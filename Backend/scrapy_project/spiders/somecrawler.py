import scrapy
import re
import tldextract
import urllib.request
import os
import json
import datetime
import requests
import codecs

# TODO add sarthaks.com


class QuotesSpider(scrapy.Spider):
    name = "spider"

    def __init__(self, question="", *args, **kwargs):
        super(QuotesSpider, self).__init__(*args, **kwargs)

        self.question = question
        self.isAnswerThere = True

        self.answer = {"answer": [], "domain": [], "success": []}

    def start_requests(self):
        try:
            q = self.question
            self.urls = self.return_links(q)["link"][:5]

            self.isAnswerThere = bool(self.urls)
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

            else:
                self.answer["success"].append(0)
        except:
            self.writetheanswer(False)

    def return_links(self, user_query):
        try:

            self.link_to_be_parsed = {}
            self.user_query = user_query
            
            self.log("[USER_QUERY]  " + str(user_query))

            google_search = "https://www.google.com/search?q=" + user_query

            
            self.rq = requests.get(google_search).text

            self.urls = re.findall(r'href=[\'"]?([^\'" >]+)', self.rq)
            self.useful_domains = ["doubtnut", "brainly",
                                   "askiitians", "stackexchange"]

            self.default_username = "bob"
            self.current_time = datetime.datetime.now().time()

            self.link_to_be_parsed["username"] = self.default_username
            self.link_to_be_parsed["current_time"] = str(self.current_time)
            self.link_to_be_parsed["link"] = []
            self.link_to_be_parsed["domain"] = []

            for url in self.urls:

                self.urlx = url[7:url.find(';') - 4]

                if tldextract.extract(self.urlx).domain in self.useful_domains:
                    self.link_to_be_parsed["link"].append(str(self.urlx))
                    self.link_to_be_parsed["domain"].append(
                        str(tldextract.extract(self.urlx).domain))

            return self.link_to_be_parsed
        except:
            self.writetheanswer(False)

    def parsebrainly(self, response):
        try:
            ans = response.xpath(
                "//div[@class='sg-text js-answer-content brn-rich-content']").extract()

            img = self.convertLinks(response.xpath(
                "//section[@id='answers']//img[@title='Attachment']/@src").extract())

            ans = self.janitor(ans)

            self.answer["domain"].append("brainly")
            self.answer["success"] = 1
            if img:
                self.answer["answer"].append([*ans, *img])
            else:
                self.answer["answer"].append([*ans])
            self.writetheanswer(True)
        except:
            pass

    def parseaskiitians(self, response):
        try:

            answer_l = response.xpath(
                '//*[@id="rptAnswers_ctl01_pnlAnswer"]').extract()
            answer_l = self.janitor(l)

            img = self.convertLinks(response.xpath(
                '//div[@id="rptAnswers_ctl01_pnlAnswer"]//img/@src').extract())

            self.answer["domain"].append("askiitans")
            self.answer["success"] = 1
            if img:
                self.answer["answer"].append([*answer_l, *img])
            else:
                self.answer["answer"].append([*answer_l])

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

            html_string = str(response.text)
            ans_txt_loc = html_string.find("Answer Text")

            html_string = html_string[ans_txt_loc:]

            p_indexes = [m.start() for m in re.finditer('</p>', html_string)][2]
            response_slice = html_string[:p_indexes]
            response_slice_loc = response_slice[::-1].find('>')
            answer = response_slice[-response_slice_loc:]
            answer = self.janitor(answer)
            self.answer["success"] = 1

            self.answer["domain"].append("doubtnut")
            self.answer["answer"].append([*answer])
            self.writetheanswer(True)
        except:
            pass

    def janitor(self, html_list):

        try:
            self.log(str(html_list))
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
        except:
            self.writetheanswer(False)

    def writetheanswer(self, works):
        if works:
            a = open("ans.json", "a+")
            a.close()
            with open("ans.json", "w") as f:

                json.dump(self.answer, f)
        else:
            self.answer = {"answer": [
                'Couldn\'t fetch answer, please try again'], "domain": ['Error'], "success": 0}
            a = open("ans.json", "a+")
            a.close()

            with open("ans.json", "w") as f:

                json.dump(self.answer, f)
