import sqlite3
from json import loads as parse
import pandas

def connect():
    conn = sqlite3.connect('requests.db')
    c = conn.cursor()
    return conn, c

def disconnect(conn, c):
    c.close()
    conn.close()

def create_table():
    conn, c = connect()
    c.execute("CREATE TABLE IF NOT EXISTS queue (id INT, qjson TEXT, ajson TEXT, status INT)")
    conn.commit()
    disconnect(conn, c)
    
def add_question(question, _id):
    conn, c = connect()
    insertion = (question, _id, 0)
    
    c.execute("INSERT INTO queue (qjson, id, status) VALUES (?, ?, ?)", insertion)
    conn.commit()
    disconnect(conn, c)

def add_answer(answer, status, _id):
    conn, c = connect()
    insertion = (answer, status, _id)
    
    c.execute("UPDATE queue SET (ajson) = (?), (status) = (?) WHERE id = (?)", insertion)
    conn.commit()
    disconnect(conn, c)

def get_answer(_id):
    conn, c = connect()
    c.execute("SELECT ajson FROM queue WHERE id = (?)", (_id,))

    a = c.fetchone()[0]
    print("[A]  " + a +"\n[TYPE_A]  " + str(type(a)))
    disconnect(conn, c)
    return parse(a)

def get_status(_id):
    conn, c = connect()
    c.execute("SELECT status FROM queue WHERE id = (?)", (_id,))

    a = c.fetchone()[0]
    disconnect(conn, c)
    return a

def delete(*args, all=False):
    conn, c = connect()
    if all:
        c.execute("DELETE FROM queue")
    else:
        for _id in args:
            c.execute("DELETE FROM queue WHERE id = (?)", (_id,))
    conn.commit()
    disconnect(conn, c)

def prt():
    conn, c = connect()
    print(pandas.read_sql_query("SELECT * FROM queue", conn))
    disconnect(conn, c)


# IT WORKS, nice