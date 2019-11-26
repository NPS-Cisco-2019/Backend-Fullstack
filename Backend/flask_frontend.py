import flask
from flask import jsonify, request
import os
import sys
import OCR.text_from_im as OCR
import time
import json

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
@app.route("/Firefox")
@app.route("/Chrome")
@app.route("/Safari")
@app.route("/Picture")
@app.route("/Answer")
@app.route("/Answer/answer0")
@app.route("/Answer/answer1")
@app.route("/Answer/answer2")
@app.route("/Answer/answer3")
@app.route("/Answer/answer4")
@app.route("/Settings")
@app.route("/Saved Answers")
@app.route("/GradeChoice")
@app.route("/Tutorial")
def my_index():
    # token can be sent, it can be anything usable by javascript
    return flask.render_template("index.html")

# Route where image is sent
@app.route("/OCR", methods=['POST', 'GET'])
def get_img():
    img = request.get_json()
    # print(img)

    question = OCR.text_from_image(img['img'])

    print(f"\n\n\n\n, [QUESTION]: {question}\n\n\n")
    # question = "brainly isomers of butane"

    print(question)

    return jsonify({'question': question})

# Route where question is sent
@app.route("/scrapy", methods=['POST', 'GET'])
def get_question():

    websites = ["stackexchange.com", "doubtnut.com",
                "askiitians.com", "brainly.in"]

    current_dict = {}
    question = request.get_json()
    
    question["question"]=question["question"].replace(" ", "+").replace("\\n", "+").replace("\\t", "+").replace("\n", "+").replace("(", "+").replace(")", "+")

    question_query = f'{question["question"]}+site%3A{join(websites, "+OR+site%3A")}'

    os.system(f'scrapy crawl spider -a question={question_query} -a subject={question["subject"]}')

    with open("ans.json", "r") as file:
        ans = json.load(file)

    # del ans["domain"]2

    # print("ANSWER:", ans)
    if ans["success"]:

        current_dict["question"] = question["question"]
        current_dict["answers"] = ans["answer"]
        current_dict["websites"] = ans["domain"]
    else:
        current_dict["question"] = question["question"]
        current_dict["answers"] = "ERROR"
        current_dict["websites"] = "NOT FOUND"

    # print("CURRENT_DICT:", current_dict)

    return jsonify(current_dict)


@app.errorhandler(404)
def error404(error):
    return flask.render_template("404.html"), 404


app.run(host="0.0.0.0")
