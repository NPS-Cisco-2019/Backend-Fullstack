import time
import os
import json

s = "scrapy crawl spider -a question="

q = [["man running"], ["integration formulae"], ["isomers of butane"]]
l_websites = ["sarthaks"]
# "askiitians", "doubtnut", "stackexchange

no_tests = 3
test_ans_json = dict(brainly={}, askiitians={}, doubtnut={}, stackexchange={}, sarthaks = {})
for i in range(len(l_websites)):
    for j in q:

        os.system(f"{s}{j[0].replace(' ', '+')}+{l_websites[i]}")
        time.sleep(5)
        with open("ans.json", "r") as f:
            x = json.load(f)

        test_ans_json[l_websites[i]][j[0]] = x

    print(f"{i} done")

with open("test_ans.json", "w") as f:
    json.dump(test_ans_json, f)
