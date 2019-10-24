import flask
from flask import jsonify, request
import os, sys
import OCR.text_from_im as OCR


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

    print(question)

    return jsonify({'question': question})

@app.route("/scrapy", methods=['POST', 'GET'])
def get_question():
    current_dict = {}
    question = request.get_json()

    os.system("scrapy crawl answerbot -a question={}".format(question["question"].replace(" ", "+")))

    with open("ans.txt", "r") as file:
        ans = eval(file.read())

    # del ans["domain"]

    print("ANSWER:", ans)

    current_dict["question"] = question["question"]
    current_dict["answers"] = ans["answer"]
    current_dict["websites"] = ans["domain"]

    print("CURRENT_DICT:", current_dict)

    return jsonify(current_dict)

app.run()