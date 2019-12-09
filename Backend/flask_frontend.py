import flask
from flask import jsonify, request, render_template, redirect, abort
import os
import sys
import OCR.text_from_im as OCR
import time
import json
import database.db_func as db
debug = False

db.create_table()


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


def join(lst, sep):
    print("[LIST] ", str(lst))

    s = ''
    for i in range(len(lst) - 1):
        s += lst[i] + sep

    s += lst[-1]

    return s


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
        websites = ["stackexchange.com", "doubtnut.com",
                    "askiitians.com", "brainly.in"]

        current_dict = {}
        question = request.get_json()

        _id = int(time.time())

        db.add_question(question["question"], _id)

        question["question"] = join(
            (question["question"].split()[:15]), "+").replace(".", "")

        question["question"] = question["question"].replace(" ", "+").replace(
            "\\n", "+").replace("\\t", "+").replace("\n", "+").replace("(", "+").replace(")", "+")


        

        os.system(
            f'scrapy crawl spider -a question={question["subject"]} -a subject ={question["subject"]} -a _id={_id}' )

        success = True

        while db.get_status(_id) != 1:
            if db.get_status(_id) == -1:
                success = False
                break

        print("\n\n\n")
        db.prt()
        print("\n\n\n")

        ans = db.get_answer(_id)

        print("\n\n\n" + str(ans) + " - " + str(type(ans)) + "\n\n\n")

        if ans["success"] and success:
            current_dict["question"] = question["question"]
            current_dict["answers"] = ans["answer"]
            current_dict["websites"] = ans["domain"]
        else:
            current_dict["question"] = question["question"]
            current_dict["answers"] = "ERROR"
            current_dict["websites"] = "NOT FOUND"

        return jsonify(current_dict)
    except Exception as e:
        log_error(e)
        abort(500)


@app.errorhandler(404)
def error404(error):
    return redirect("/Unknown")


app.run(host="0.0.0.0")
