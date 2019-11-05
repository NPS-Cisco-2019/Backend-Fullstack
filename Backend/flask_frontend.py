import flask
from flask import jsonify, request
import os, sys
import OCR.text_from_im as OCR
import time


app = flask.Flask("__main__")

@app.route("/")
def my_index():
    # token can be sent, it can be anything usable by javascript
    return flask.render_template("index.html")

@app.route("/OCR", methods=['POST', 'GET'])
def get_img():
    img = request.get_json()
    # print(img)

    question = OCR.text_from_image(img['img'])
    # question = "iitians man running"

    print(question)

    return jsonify({'question': question})

@app.route("/scrapy", methods=['POST', 'GET'])
def get_question():
    current_dict = {}
    question = request.get_json()

    question

    os.system('scrapy crawl spider -a question="{}"'.format(question["question"].replace(" ", "+").replace("\\n", "+").replace("\\t", "+")+"site%3Adoubtnut.com+OR+site%3Aaskiitians.com+OR+site%3Abrainly.in"))

    with open("ans.txt", "r") as file:
        ans = eval(file.read())

    # del ans["domain"]

    print("ANSWER:", ans)

    current_dict["question"] = question["question"]
    current_dict["answers"] = ans["answer"]
    current_dict["websites"] = ans["domain"]

    print(type(current_dict["answers"]), type(current_dict["websites"]))

    print("CURRENT_DICT:", current_dict)

    return jsonify(current_dict)

app.run(host="0.0.0.0")