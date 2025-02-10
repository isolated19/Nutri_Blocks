from flask import Flask, redirect,url_for, session,render_template,request,jsonify
import sqlite3

app=Flask(__name__)
app.secret_key='123'
sqlconnection=sqlite3.connect('health.db')
sqlconnection.execute(''' CREATE TABLE IF NOT EXISTS HGAME(ID INTEGER PRIMARY KEY, USERNAME TEXT, SCORE INTERGER, TIME INTEGER)''')
sqlconnection.close()

@app.route('/')
def index():
   
    return render_template('index.html')

@app.route('/save_name',methods=["POST","GET"])
def playername():

        if request.method=='POST':
                
            # Retrieve the username from the form data
            username=request.form.get('username') 
            # store the username in the session
            session['username']=username

            # Redirect or render the game page
            return redirect (url_for('save_info' )) # This will call the 'save_info' route to show the game page

# Save Score API
@app.route('/save_score', methods=['POST'])
def save_score():
    data = request.json
    player_name = data.get('player_name', 'Anonymous')
    score = data.get('score', 0)

    with sqlite3.connect("database.db") as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO scores (player_name, score) VALUES (?, ?)", (player_name, score))
        conn.commit()

    print(f"Score Saved: {player_name} - {score}")  # Display in terminal
    return jsonify({"message": "Score saved successfully!"})
   

# Get Leaderboard
@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    with sqlite3.connect("database.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT player_name, score FROM scores ORDER BY score DESC LIMIT 10")
        scores = [{"player_name": row[0], "score": row[1]} for row in cursor.fetchall()]

    return jsonify(scores)
if __name__=="__main__":
    app.run(debug=True)