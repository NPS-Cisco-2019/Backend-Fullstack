import scrapy
import json
import re
import tldextract
import urllib.request
import os
import json
import datetime
import requests


class QuotesSpider(scrapy.Spider):
    name = "spider"

    def __init__(self, question=None, *args, **kwargs):
        super(QuotesSpider, self).__init__(*args, **kwargs)
        self.question = question
        self.isAnswerThere = True

        self.log(self.question)
        self.answer = {"answer": [], "domain": [], "success": []}

    def start_requests(self):

        q = self.question
        self.urls = self.return_links(q)["link"][:5]
        self.log("[LINKS GOT IN START_REQUESTS]")
        self.log(str(bool(self.urls)))
        self.isAnswerThere = bool(self.urls)
        if self.isAnswerThere:
            for url in self.urls:
                listt = tldextract.extract(url)
                website = listt.domain
                if website == 'brainly':
                    yield scrapy.Request(url=url, callback=self.parsebrainly)
                elif website == 'askiitians':
                    yield scrapy.Request(url=url, callback=self.parseaskiitans)
                elif website == 'doubtnut':
                    yield scrapy.Request(url=url, callback=self.parsedoubtnut)
                elif website == 'stackexchange':
                    yield scrapy.Request(url=url, callback=self.parsestackexchange)

        else:
            self.answer["success"].append(0)
            self.writetheanswer()

    def return_links(self, user_query):
        self.log("RETURN LINKS CALL")
        self.link_to_be_parsed = {}
        self.user_query = user_query

        google_search = "https://www.google.com/search?q=" + self.user_query
        self.rq = requests.get(google_search).text

        self.urls = re.findall(r'href=[\'"]?([^\'" >]+)', self.rq)
        self.useful_domains = ["doubtnut", "brainly",
                               "askiitians", "topperlearning", "stackexchange"]

        self.default_username = "bob"
        self.current_time = datetime.datetime.now().time()

        self.link_to_be_parsed["username"] = self.default_username
        self.link_to_be_parsed["current_time"] = str(self.current_time)
        self.link_to_be_parsed["link"] = []
        self.link_to_be_parsed["domain"] = []

        for url in self.urls:
            # string format url based on how google's internal system works
            self.urlx = url[7:url.find(';') - 4]

            if tldextract.extract(self.urlx).domain in self.useful_domains:
                self.link_to_be_parsed["link"].append(str(self.urlx))
                self.link_to_be_parsed["domain"].append(
                    str(tldextract.extract(self.urlx).domain))
        self.log(str(self.link_to_be_parsed))

        return self.link_to_be_parsed

    def parsebrainly(self, response):
        ans = response.xpath(
            "//div[@class='sg-text js-answer-content brn-rich-content']").extract()

        imgsrc = response.xpath(
            "//section[@id='answers']//img[@title='Attachment']/@src").getall()

        ans = self.janitor(str(ans))

        self.answer["domain"].append("brainly")
        self.answer["success"] = 1
        if imgsrc:
            self.answer["answer"].append([*ans, imgsrc])
        else:
            self.answer["answer"].append([*ans, 0])
        self.writetheanswer()

        # self.log(self.answer)

    """ def downloadImage(self,urll, urllname):
        
        urllib.request.urlretrieve(self.urll, self.urllname) """

    def parseaskiitans(self, response):
        self.log("WWW>ASKIITIANS.COM STARTED")
        l = str(response.xpath(
            '//*[@id="rptAnswers_ctl01_pnlAnswer"]').extract())
        l = self.janitor(l)

        img = response.xpath(
            '//div[@id="rptAnswers_ctl01_pnlAnswer"]//img/@src').extract()

        self.answer["domain"].append("askiitans")
        self.answer["success"] = 1
        if img:
            self.answer["answer"].append([*l, img])
        else:
            self.answer["answer"].append([*l, 0])

        self.writetheanswer()

    def parsestackexchange(self, response):
        answer = response.xpath("//div[@class='post-text']/p/text()").extract()
        links = response.xpath("//div[@class='post-text']//a/@href").extract()
        for i in range(len(answer)):
            answer[i] = answer[i].replace("$$". "$")

        self.answer["answer"].append([*answer, *(self.convertLinks(links))])
        self.answer["domain"].append("Stack Exchange")
        self.answer["success"] = 1
        # with open("ans.txt", "w") as f:
        #     for dom in self.answer["domain"]:
        #         if dom == "Stack Exchange":

        self.writetheanswer()

    def parsedoubtnut(self, response):
        self.log("D FOR DOUBTNUT")

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
        self.answer["answer"].append([*answer, 0])
        self.writetheanswer()

    def janitor(self, raw_html):
        split_str = '!@#$%^&*()'

        # self.log(str(raw_html))

        # cleanr = re.compile('<.*?>')
        # self.log("[]")
        # self.log("[UNCLEANED TEXT]")
        # self.log(str(cleanr))
        cleantext = re.sub('<br/?>', split_str, raw_html)
        cleantext = re.sub('&lt;br&gt;', split_str, cleantext)
        cleantext = re.sub('<p.*?>', split_str, cleantext)
        cleantext = re.sub('&gt;', '>', cleantext)
        cleantext = re.sub('<.*?>', ' ', cleantext)
        cleantext = re.sub('\\\\xa0', ' ', cleantext)

        cleantext = re.sub('?\\\\[A-Za-z]? ', ' ', cleantext)

        self.log("[DATA]")
        self.log(cleantext)
        self.log(type(cleantext))

        cleantext = str(cleantext).rstrip(" []'")
        cleantext = str(cleantext).lstrip("[] '")
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

        self.log("[CLEANED TEXT]")

        self.log(cleantext)
        l = cleantext.split(split_str)
        i = 0
        self.log("[LIST] : {}".format(l))
        while i < len(l):
            if l[i] == ' ' or l[i] == '':
                l.pop(i)
            i += 1

        return l

    def convertLinks(self, links):
        for link in links:
            link = "link"+link

        return links

    def writetheanswer(self):
        a = open("ans.txt", "a+")
        a.close()
        with open("ans.txt", "w") as f:
            f.write(str(self.answer))
