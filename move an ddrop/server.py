from flask import Flask ,request,render_template,redirect,flash,session,url_for,jsonify


import sqlite3

app=Flask(__name__)
app.secret_key='123'


sqlconnection =sqlite3.connect("healthy_game.db")
sqlconnection.execute('''create table if not exists scores(id integer primary key autoincrement,username text,score integer, time text
)''')
sqlconnection.close()



@app.route('/')
def index():
    return render_template('index.html')


@app.route("/save_name", methods=["GET", "POST"])
def save_name():
    if request.method == "POST":
        session["username"] = request.form["username"]
        print("the username is", session["username"])
        return redirect(url_for("game"))
    return render_template("index.html")



@app.route('/game')
def game():
    if 'username' not in session:
        return redirect('/')
    return render_template('game.html', username=session['username'])


@app.route("/save_score", methods=["POST"])
def save_score():
    data = request.json
    username = data["username"]
    score = data["score"]
    time = data["time"]
    print("Received data:", data)  # Debugging log
    conn = sqlite3.connect("healthy_game.db")
    c = conn.cursor()
    c.execute("INSERT INTO scores (username, score, time) VALUES (?, ?, ?)", (username, score, time))
    conn.commit()
    conn.close()
    return jsonify({"message": "Score saved successfully!"})


@app.route("/leaderboard")
def leaderboard():
    conn = sqlite3.connect("healthy_game.db")
    c = conn.cursor()
    c.execute("SELECT username, score, time FROM scores ORDER BY score DESC LIMIT 10")
    scores = c.fetchall()
    conn.close()
    return render_template("leaderboard.html", scores=scores)




if __name__=="__main__":
    app.run(debug=True)

