import flask
from flask import jsonify, request, render_template, redirect, abort, make_response, send_from_directory
import os
import sys
import OCR.text_from_im as OCR
import time
import database.db_func as db
from config_backend import debug 

db.create_table()
'''
  ██████  ███▄    █  ▄▄▄       ██▓███    ██████ ▓█████ ▄▄▄       ██▀███   ▄████▄   ██░ ██        ██▓ ███▄    █  ▄████▄          
▒██    ▒  ██ ▀█   █ ▒████▄    ▓██░  ██▒▒██    ▒ ▓█   ▀▒████▄    ▓██ ▒ ██▒▒██▀ ▀█  ▓██░ ██▒      ▓██▒ ██ ▀█   █ ▒██▀ ▀█          
░ ▓██▄   ▓██  ▀█ ██▒▒██  ▀█▄  ▓██░ ██▓▒░ ▓██▄   ▒███  ▒██  ▀█▄  ▓██ ░▄█ ▒▒▓█    ▄ ▒██▀▀██░      ▒██▒▓██  ▀█ ██▒▒▓█    ▄         
  ▒   ██▒▓██▒  ▐▌██▒░██▄▄▄▄██ ▒██▄█▓▒ ▒  ▒   ██▒▒▓█  ▄░██▄▄▄▄██ ▒██▀▀█▄  ▒▓▓▄ ▄██▒░▓█ ░██       ░██░▓██▒  ▐▌██▒▒▓▓▄ ▄██▒        
▒██████▒▒▒██░   ▓██░ ▓█   ▓██▒▒██▒ ░  ░▒██████▒▒░▒████▒▓█   ▓██▒░██▓ ▒██▒▒ ▓███▀ ░░▓█▒░██▓      ░██░▒██░   ▓██░▒ ▓███▀ ░ ██▓    
▒ ▒▓▒ ▒ ░░ ▒░   ▒ ▒  ▒▒   ▓▒█░▒▓▒░ ░  ░▒ ▒▓▒ ▒ ░░░ ▒░ ░▒▒   ▓▒█░░ ▒▓ ░▒▓░░ ░▒ ▒  ░ ▒ ░░▒░▒      ░▓  ░ ▒░   ▒ ▒ ░ ░▒ ▒  ░ ▒▓▒    
░ ░▒  ░ ░░ ░░   ░ ▒░  ▒   ▒▒ ░░▒ ░     ░ ░▒  ░ ░ ░ ░  ░ ▒   ▒▒ ░  ░▒ ░ ▒░  ░  ▒    ▒ ░▒░ ░       ▒ ░░ ░░   ░ ▒░  ░  ▒    ░▒     
░  ░  ░     ░   ░ ░   ░   ▒   ░░       ░  ░  ░     ░    ░   ▒     ░░   ░ ░         ░  ░░ ░       ▒ ░   ░   ░ ░ ░         ░      
      ░           ░       ░  ░               ░     ░  ░     ░  ░   ░     ░ ░       ░  ░  ░       ░           ░ ░ ░        ░     
                                                                         ░                                     ░          ░     
'''
def log_error(*args):
    s = "[" + time.strftime("%d-%m %H:%M:%S") + " IST]   "
    for arg in args:
        s += str(arg) + " "
    s += "\n\n"

    if debug:
        print(s)
    else:
        with open(os.path.join(os.getcwd(), "error_logs", "flask.log"), "a+") as f:
            f.write(s)

# function to join all the websites


def ans_len(lst):
    length = 0
    for s in ans_len:
        length += len(s)
    return length


app = flask.Flask("__main__")

# Frontend route
@app.route("/")
@app.route("/Answer")
@app.route("/Answer/answer0")
@app.route("/Answer/answer1")
@app.route("/Answer/answer2")
@app.route("/Answer/answer3")
@app.route("/Answer/answer4")
@app.route("/Chrome")
@app.route("/Firefox")
@app.route("/GradeChoice")
@app.route("/Picture")
@app.route("/Safari")
@app.route("/Saved Answers")
@app.route("/Settings")
@app.route("/Tutorial")
@app.route("/Unknown")
def main():
    return render_template("index.html")

# Route where image is sent
@app.route("/OCR", methods=['POST', 'GET'])
def get_question():
    try:
        img = request.get_json()

        question = OCR.text_from_image(img['img'])
        # question = "brainly man running"

        print(f"\n\n\n\n, [QUESTION]: {question}\n\n\n")

        return jsonify({'question': question})
    except Exception as e:
        log_error(e)
        abort(500)

# Route where question is sent
@app.route("/scrapy", methods=['POST', 'GET'])
def get_answer():
    try:
  

        current_dict = {}
        question = request.get_json()
        _id = int(time.time())
        db.add_question(question["question"], _id)

        question["question"] = question["question"].replace(" ", "+").replace(
            "\\n", "+").replace("\\t", "+").replace("\n", "+").replace("(", "+").replace(")", "+")
        print(
            f'scrapy crawl spider -a question={question["question"]} -a subject=revisionNotes  -a _id={_id}')
        os.system(
            f'scrapy crawl spider -a question={question["question"]} -a subject=revisionNotes  -a _id={_id}')

        success = True

        while db.get_status(_id) != 1:
            if db.get_status(_id) == -1:
                success = False
                break

        # print("\n\n\n")
        # db.prt()
        # print("\n\n\n")

        ans = db.get_answer(_id)

        # print("\n\n\n" + str(ans) + " - " + str(type(ans)) + "\n\n\n")

        if ans["success"] and success:
            current_dict["question"] = question["question"]
            current_dict["answers"] = sorted(ans["answer"], key=ans_len, reverse=True)
            current_dict["websites"] = ans["domain"]
        else:
            current_dict["question"] = question["question"]
            current_dict["answers"] = "ERROR"
            current_dict["websites"] = "NOT FOUND"

        return jsonify(current_dict)
    except Exception as e:
        log_error(e)
        abort(500)

@app.route("/static/react/service-worker.js")
def sw():
    a = send_from_directory("static/react", "service-worker.js")
    print("SERVICE", a)
    res = make_response(a)
    res.headers["Service-Worker-Allowed"] = "/"

    return res

@app.errorhandler(404)
def error404(error):
    return redirect("/Unknown")


app.run(host="0.0.0.0", debug=True)
