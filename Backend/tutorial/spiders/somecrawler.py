import scrapy
import json
import re
import tldextract
import urllib.request
import os
import json
import datetime
#from ast import literal_eval


class QuotesSpider(scrapy.Spider):
    name = "answerbot"


    def start_requests(self):
        default_username = "bob"
        current_time =  datetime.datetime.now().time()
        answerdict = {"user": default_username, "time" :current_time, "answer" :{}}

##     with open('hi.json', 'a+') as aa:
##     d = {"user":"bob","current":str(datetime.datetime.time().now()),"a":[]}
##     json.dump(d,aa)

        with open('linkjson.txt', 'r') as jsonf:
           # txtfile = jsonf.read()
           # urls = str(txtfile)
            urls = json.load(jsonf)


        #urls = ["https://doubtnut.com/question-answer-physics/block-a-of-mass-m-and-block-b-of-mass-2m-are-placed-on-a-fixed-traingular-wedge-by-means-of-a-massle-11297417"]
        urls = urls["link"][:5]
        self.log(urls)
        for url in urls:

           listt = tldextract.extract(url)

           website = listt.domain
           if website == 'brainly':
               yield scrapy.Request(url=url, callback=self.parsebrainly)
           elif website == 'askiitians':
               yield scrapy.Request(url=url, callback=self.parseaskiitans)
           elif website == 'doubtnut':
               yield scrapy.Request(url=url, callback=self.parsedoubtnut)


    def parsebrainly(self, response):
        
          
            
            l = str(response.xpath('//script[@type ="application/ld+json"]').extract())[39:-13].replace("\\n", "")
            answerjson = json.loads(l)
            ans = str(answerjson["mainEntity"]["suggestedAnswer"][0]["text"])
            print(ans)
            print("\n \n \n")
            #answerdict["answerdict"]["brainly"] = ans

            
    """ def downloadImage(self,urll, urllname):
        
        urllib.request.urlretrieve(self.urll, self.urllname) """

    def parseaskiitans(self, response):
        with open("ians.txt", "a+") as f:
            self.log("ask")
            l = response.xpath(
                '//div[@id ="rptAnswers_ctl01_pnlAnswer"]//div').extract()[3][5:-6]
            imgsrc = response.xpath(
                '//div[@id ="rptAnswers_ctl01_pnlAnswer"]//div//img[@src]').extract()[0]
            imgsrc = imgsrc[imgsrc.find('src="')+5:imgsrc.find('.jpg"') + 4]
            #downloadImage(imgsrc, "A")
            urllib.request.urlretrieve(imgsrc, "img_Ask")
            self.log(imgsrc)
            f.write(str(l))
            f.write(str(imgsrc))
##            txt =l[0]
##            jobj = json.loads(txt)
##            ans = str(answerjson["mainEntity"]["suggestedAnswer"][0]["text"])
##

    def parsedoubtnut(self, response):
        self.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
        with open("hi.txt", "a+") as ff:
            ff.write("HELLO")
        with open("dans.txt", "a+") as f:
            
            htmls = str(response.text)
            i_ans_text = htmls.find("Answer Text")
            htmls = htmls[i_ans_text:]
            #[m.start() for m in re.finditer('test', 'test test test test')]
            p_indexes = [m.start() for m in re.finditer('</p>', htmls)][2]
            half_almost_answer = htmls[:p_indexes]
            ind_almost_answer = half_almost_answer[::-1].find('>')
            answer = half_almost_answer[-ind_almost_answer:]
            

            #txt =l[0]
            #jobj = json.loads(txt)
            f.write(str(answer))
