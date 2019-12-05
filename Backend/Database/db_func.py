import sqlite3
from json import dumps as stringify
def create_table(name):
    conn = sqlite3.connect('requests.db')
    c = conn.cursor()
    c.execute('CREATE TABLE questions(qjson, ajson, status)')
    conn.commit()
    conn.close()
    
def add_question(question):                                        
    conn = sqlite3.connect('requests.db')
    c = conn.cursor()
    insertion = [stringify(question)]
    
    c.executemany("INSERT INTO questions (qjson) VALUES (?)", insertion)
    conn.commit()
    conn.close()

def add_answer(answer):                                        
    conn = sqlite3.connect('requests.db')
    c = conn.cursor()
    insertion = [stringify(answer)]
    
    c.executemany("INSERT INTO questions (ajson) VALUES (?)",insertion)
    conn.commit()
    conn.close()

def run_request():
    conn = sqlite3.connect('requests.db')
    c = conn.cursor()
    for row in c.execute("SELECT * FROM questions"):