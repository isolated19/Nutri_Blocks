from flask import Flask ,request,render_template,redirect,flash,session,url_for


import sqlite3

app=Flask(__name__)
app.secret_key='123'


sqlconnection =sqlite3.connect("healthy_game.db")
sqlconnection.execute('''create table if not exists hgame(id integer primary key,username text,score integer)''')
sqlconnection.close()



@app.route('/')
def index():
    return render_template('index.html')
@app.route('/save_name', methods=['POST','GET'])
def playername():
    username=session.get('username')


    
    return redirect(url_for('game',username=username))


@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/leaderboard')
def client():
    return render_template('leaderboard.html')




if __name__=="__main__":
    app.run(debug=True)

    