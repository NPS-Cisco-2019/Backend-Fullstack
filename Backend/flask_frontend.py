import flask
from flask import jsonify, request
import os, sys
# TODO ADD SCRAPY
# import tutorial.SE as scrapy
#import OCR.text_from_im as OCR


app = flask.Flask("__main__")




@app.route("/")
def my_index():
    # token can be sent, it can be anything usable by javascript
    return flask.render_template("index.html")

@app.route("/OCR", methods=['POST', 'GET'])
def get_img():
    img = request.get_json()
    # print(img)

    #question = OCR.text_from_image(img['img'])
    question = "brainly man running"

    print(question)

    return jsonify({'question': question})

@app.route("/scrapy", methods=['POST', 'GET'])
def get_question():
    question = request.get_json()
    os.system("scrapy crawl anserbot -a question={}".format(question["question"].replace(" ", "+")))
    with open("ans.txt", "r") as file:
        ans = eval(file.read())
    print("scrapy running....")

    
    del ans["domain"]
    print(ans)
    current_dict = ans["question"] = question["question"]







    

    # scrapy.return_links('brainly+man+runs')

    # implement Scrapey
    return jsonify(current_dict)

app.run()