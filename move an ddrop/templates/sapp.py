from flask import Flask, redirect, url_for, session, render_template, request, jsonify
import sqlite3

app = Flask(__name__)
app.secret_key = '123'

# Initialize the database connection (use shealth.db for consistency)
with sqlite3.connect('shealth.db') as sqlconnection:
    sqlconnection.execute(''' 
        CREATE TABLE IF NOT EXISTS HGAME(
            ID INTEGER PRIMARY KEY, 
            USERNAME TEXT, 
            SCORE INTEGER, 
            TIME INTEGER
        )
    ''')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save_name', methods=["POST", "GET"])
def playername():
    if request.method == 'POST':
        # Retrieve the username from the form data
        username = request.form.get('username')
        
        # Store the username in the session
        session['username'] = username
        
        # Redirect to game page after saving the username
        return redirect(url_for('save_info'))

    # Handle GET request if needed
    return render_template('index.html')

@app.route('/game')
def save_info():
    # Get the username from the session
    username = session.get('username')
    
    if username:
        # Render the game page with the username passed to the template
        return render_template('game.html', username=username)
    else:
        # Redirect to the homepage if the username is not found
        return redirect(url_for('index'))

# Save Score API
@app.route('/save_score', methods=['POST'])
def save_score():
    data = request.json
    player_name = data.get('player_name', 'Anonymous')
    score = data.get('score', 0)

    # Ensure you are using the same database as created earlier (shealth.db)
    with sqlite3.connect("shealth.db") as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO HGAME (USERNAME, SCORE) VALUES (?, ?)", (player_name, score))
        conn.commit()

    print(f"Score Saved: {player_name} - {score}")  # Display in terminal
    return jsonify({"message": "Score saved successfully!"})

# Get Leaderboard
@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    with sqlite3.connect("shealth.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT USERNAME, SCORE FROM HGAME ORDER BY SCORE DESC LIMIT 10")
        scores = [{"player_name": row[0], "score": row[1]} for row in cursor.fetchall()]

    return jsonify(scores)

if __name__ == "__main__":
    app.run(debug=True)
