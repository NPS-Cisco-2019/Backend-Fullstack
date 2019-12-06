import scrapy
import re
import tldextract
import urllib.request
import os, sys
import json
import time
import requests
import codecs
# sys.path.append(os.path.join(os.getcwd()[::-1].split("/", 2)[-1][::-1], "database"))
# print(sys.path)
from database.db_func import add_answer, connect, disconnect
from json import dumps as stringify 

class QuotesSpider(scrapy.Spider):
    name = "spider"

    def __init__(self, question="", _id=0, *args, **kwargs):
        super(QuotesSpider, self).__init__(*args, **kwargs)

        self.question = question
        self.isAnswerThere = True
        self.id = _id
        self.debug = False

        self.log("\n\n\n\n\n" + str(_id) + "\n\n\n\n\n\n")

        self.answer = {"answer": [], "domain": [], "success": []}

    def log_error(self, *args):
        s = "[" + time.strftime("%d-%m %H:%M:%S") + " IST]   "
        for arg in args:
            s += str(arg) + " "
        s += "\n\n"
        if self.debug:
            print(s)
        else:
            with open(os.path.join(os.getcwd(), "error_logs", "scrapy.log"), "a+") as f:
                f.write(s)

    def start_requests(self):
        try:
            self.log("[STARTED REQUETS]")
            q = self.question
            self.urls = self.return_links(q)["link"][:5]

            self.log("[URLS]  " + str(self.urls) + " ----- [LEN]  " + str(len(self.urls)))

            self.isAnswerThere = len(self.urls) != 0
            if self.isAnswerThere:
                self.answer["success"].append(1)
                for url in self.urls:
                    listt = tldextract.extract(url)
                    website = listt.domain
                    if website == 'brainly':
                        yield scrapy.Request(url=url, callback=self.parsebrainly)
                    elif website == 'askiitians':
                        yield scrapy.Request(url=url, callback=self.parseaskiitians)
                    elif website == 'doubtnut':
                        yield scrapy.Request(url=url, callback=self.parsedoubtnut)
                    elif website == 'stackexchange':
                        yield scrapy.Request(url=url, callback=self.parsestackexchange)
                    elif website == 'sarthaks':
                        yield scrapy.Request(url=url, callback=self.parsesarthaks)
            else:
                self.answer["success"] = 0
                self.writetheanswer(False)
        except Exception as e:
            #  self.log("[FAILED1]")
             self.writetheanswer(False, e)

    def return_links(self, user_query):
        try:
            

            self.link_to_be_parsed = {}
            self.log("[reahced A]")
            self.user_query = user_query
            
            user_query = user_query.replace("++", "+")

            self.log("\n" + "-" * 50 + "\n[USER_QUERY]  " + str(user_query))

            google_search = "https://www.google.com/search?q=" + user_query
            
            self.rq = requests.get(google_search).text

            self.urls = re.findall(r'href=[\'"]?([^\'" >]+)', self.rq)
            self.useful_domains = ["doubtnut", "brainly",
                                   "askiitians", "stackexchange","sarthaks"]

            self.default_username = "bob"

            self.link_to_be_parsed["username"] = self.default_username
            self.link_to_be_parsed["link"] = []
            self.link_to_be_parsed["domain"] = []

            for url in self.urls:

                self.urlx = url[7:url.find(';') - 4]

                if tldextract.extract(self.urlx).domain in self.useful_domains:
                    self.link_to_be_parsed["link"].append(str(self.urlx))
                    self.link_to_be_parsed["domain"].append(
                        str(tldextract.extract(self.urlx).domain))
                self.log("[RETURNED LINKS]")

            return self.link_to_be_parsed
        except Exception as e:
            self.writetheanswer(False, e)

    def parsebrainly(self, response):
        try:
            ans = response.xpath(
                "//div[@class='sg-text js-answer-content brn-rich-content']").extract()

            imgsrc = self.convertLinks(response.xpath(
                "//section[@id='answers']//img[@title='Attachment']/@src").extract())

            ans = self.janitor(ans)

            self.answer["domain"].append("brainly")
            self.answer["success"] = 1
            if imgsrc:
                self.answer["answer"].append([*ans, imgsrc])
            else:
                self.answer["answer"].append([*ans])
            self.writetheanswer(True)
        except:
            pass

    def parseaskiitians(self, response):
        try:

            l = response.xpath(
                '//*[@id="rptAnswers_ctl01_pnlAnswer"]').extract()
            l = self.janitor(l)

            img = self.convertLinks(response.xpath(
                '//div[@id="rptAnswers_ctl01_pnlAnswer"]//img/@src').extract())

            self.answer["domain"].append("askiitans")
            self.answer["success"] = 1

            if type(img) != list:
                img = [img]
            
            if img:
                self.answer["answer"].append([*l, *img])
            else:
                self.answer["answer"].append([*l])

            self.writetheanswer(True)
        except:
            pass

    def parsestackexchange(self, response):
        try:
            answer = response.xpath(
                "//div[@class='post-text']/p/text()").extract()
            links = self.convertLinks(response.xpath(
                "//div[@class='post-text']//a/@href").extract())
            for i in range(len(answer)):
                answer[i] = answer[i].replace("$$", "$")

            self.answer["answer"].append([*answer, *links])
            self.answer["domain"].append("Stack Exchange")
            self.answer["success"] = 1

            self.writetheanswer(True)
        except:
            pass

    def parsedoubtnut(self, response):
        try:

            htmls = str(response.text)
            i_ans_text = htmls.find("Answer Text")

            htmls = htmls[i_ans_text:]

            p_indexes = [m.start() for m in re.finditer('</p>', htmls)][2]
            half_almost_answer = htmls[:p_indexes]
            ind_almost_answer = half_almost_answer[::-1].find('>')
            answer = half_almost_answer[-ind_almost_answer:]
            answer = self.janitor(answer)
            self.answer["success"] = 1

            self.answer["domain"].append("doubtnut")
            self.answer["answer"].append([*answer])
            self.writetheanswer(True)
        except:
            pass
    def parsesarthaks(self,response):      
        try:
            ans = response.xpath('//div[@class="qa-a-item-content qa-post-content"]/div[@itemprop="text"]/*').extract()
            
            links = response.xpath('//div[@class="qa-a-item-content qa-post-content"]/div[@itemprop="text"]/p//span/img/@src').extract()
            
            ans = self.janitor(ans)

            i = 0

            while i < len(ans):
                if ans[i] == "":
                    ans.pop(i)
                else:
                    i += 1

            self.answer["domain"].append("Sarthaks")
            if len(ans) > 0:
                self.answer["answer"].append([*ans, *links])
                self.answer["success"] = 1
                self.writetheanswer(True)
            

        except:
            pass

    def janitor(self, html_list):

        try:
            
            if type(html_list) != list:
                html_list = [html_list]

            ans_list = []

            for raw_html in html_list:
                split_str = '##SPLIT##'

                cleantext = re.sub('<br/?>', split_str, raw_html)
                cleantext = re.sub('&lt;br&gt;', split_str, cleantext)
                cleantext = re.sub('<p.*?>', split_str, cleantext)
                cleantext = re.sub('&gt;', '>', cleantext)
                cleantext = re.sub('<.*?>', ' ', cleantext)
                cleantext = re.sub('\\\\xa0', ' ', cleantext)

                cleantext = re.sub('\\\\[A-Za-z]', ' ', cleantext)
                cleantext = re.sub("\\n", split_str, cleantext)

                cleantext = str(cleantext).rstrip(" []'")
                cleantext = str(cleantext).lstrip("[] '")
                i = 0
                while i < len(cleantext) - 1:
                    if cleantext[i] == '$' and cleantext[i+1] != "$":
                        cleantext = cleantext[:i] + "$$" + cleantext[i+1:]
                        i += 2

                    i += 1

                i = 0
                spaceFound = False
                while i < len(cleantext):

                    if cleantext[i] == " " and spaceFound == False:
                        temp = i
                        spaceFound = True
                    if cleantext[i] != " " and spaceFound == True:
                        spaceFound = False
                        cleantext = cleantext[:temp] + " " + cleantext[i:]
                    i += 1

                l = cleantext.split(split_str)

                i = 0

                while i < len(l):
                    if l[i] == ' ' or l[i] == '':
                        l.pop(i)
                    i += 1

                ans_list += l

            return ans_list
        except:
            pass

    def convertLinks(self, links):
        try:

            if type(links) != list:
                links = links.split(",")
            newLinks = []

            for i in range(len(links)):
                links.extend(links.pop(0).split(','))

            for link in links:

                newLinks.append("link"+link)
            return newLinks
        except Exception as e:
            self.writetheanswer(False, e)

    def writetheanswer(self, works, e = ""):
        conn, c = connect()
        if works:
            add_answer(stringify(self.answer), 1, self.id)
        else:
            self.log_error(e)

            self.answer = {
                "answer": ['Couldn\'t fetch answer, please try again'],
                "domain": ['Error'],
                "success": 0
            }

            add_answer(stringify(self.answer), -1, self.id)
