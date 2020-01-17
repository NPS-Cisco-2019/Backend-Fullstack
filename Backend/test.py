import time
import os
import json
import database.db_func as db
a = os.getcwd()

db.create_table()

s = "scrapy crawl spider -a question="

q = ["two moles of helium are mixed with n moles of hydrogen. If cp/cv = 3/2 for the mixture then the value of n is :"]
l_websites = sorted(["sarthaks", "askiitians", "doubtnut", "stackexchange", "brainly"])
websites = sorted(["stackexchange.com", "doubtnut.com",
                    "askiitians.com", "brainly.in", "sarthaks.com"])

l_websites


def join(lst, sep):
    print("[LIST] ", str(lst))

    s = ''
    for i in range(len(lst) - 1):
        s += lst[i] + sep

    s += lst[-1]

    return s


no_tests = 3
test_ans_json = dict(brainly={}, askiitians={},
                     doubtnut={}, stackexchange={}, sarthaks={})
for i in range(len(l_websites)):
    for j in q:


        current_dict = {}

        _id = int(time.time())

        db.add_question(j, _id)

        j = join(
            (j.split()[:15]), "+").replace(".", "")

        j = j.replace(" ", "+").replace(
            "\\n", "+").replace("\\t", "+").replace("\n", "+").replace("(", "+").replace(")", "+")

        j += "+site%3A"+websites[i]

        print( f'scrapy crawl spider -a question={j} -a _id={_id}')
        os.system( f'scrapy crawl spider -a question={j} -a _id={_id}')

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
            current_dict["question"] = j
            current_dict["answers"] = ans["answer"]
            current_dict["websites"] = ans["domain"]
        else:
            current_dict["question"] = j
            current_dict["answers"] = "ERROR"
            current_dict["websites"] = "NOT FOUND"

        test_ans_json[l_websites[i]][j] = current_dict

    print(f"{i+1} done")

print(test_ans_json)

with open("test_ans.json", "w") as f:
    json.dump(test_ans_json, f)
