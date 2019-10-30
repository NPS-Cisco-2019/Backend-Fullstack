import scrapy
import json
import re
import tldextract
import urllib.request
import os
import json
import datetime
#from bs4 import BeautifulSoup
import requests
#from ..\..items import CiscoProjectItem

class QuotesSpider(scrapy.Spider):
    name = "answerbot"
    

    
    def __init__(self, question=None, *args, **kwargs):
        super(QuotesSpider, self).__init__(*args, **kwargs)
        self.question = question

        self.log(self.question)
        self.answer =  { "answer": [] ,"domain" : [] }


    def start_requests(self):



        
        
        #log(return_links(x.replace(" ", "+")))
        default_username = "bob"
        current_time =  datetime.datetime.now().time()
        answerdict = {"user": default_username, "time" :current_time, "answer" :{}}
        q = self.question
        self.urls = self.return_links(q)["link"][:5]
        
        
        self.log(str(str(self.urls)))
        for url in self.urls:

           listt = tldextract.extract(url)
           

           website = listt.domain
           if website == 'brainly':
               yield scrapy.Request(url=url, callback=self.parsebrainly)
           elif website == 'askiitians':
               yield scrapy.Request(url=url, callback=self.parseaskiitans)
           elif website == 'doubtnut':
               yield scrapy.Request(url=url, callback=self.parsedoubtnut)

        




    def return_links(self,user_query):
        self.log("RETURN LINKS CALL")
        self.link_to_be_parsed = {}
        self.user_query = user_query

        
        
        self.google_search = "https://www.google.com/search?q=" + self.user_query
        self.rq = requests.get(self.google_search).text 
        
        self.urls = re.findall(r'href=[\'"]?([^\'" >]+)', self.rq)
        self.useful_domains = ["doubtnut","brainly", "askiitians","topperlearning", "byjus"]
        
        self.default_username = "bob"
        self.current_time =  datetime.datetime.now().time()
        
        self.link_to_be_parsed["username"] = self.default_username
        self.link_to_be_parsed["current_time"] = str(self.current_time)
        self.link_to_be_parsed["link"] = []
        self.link_to_be_parsed["domain"] = []
       
        for url in self.urls:
            #string format url based on how google's internal system works
            
         
            self.urlx = url[7:url.find(';') -4]
            
            if tldextract.extract(self.urlx).domain in self.useful_domains :
               self.link_to_be_parsed["link"].append(str(self.urlx))
               self.link_to_be_parsed["domain"].append(str(tldextract.extract(self.urlx).domain))
        self.log(str(self.link_to_be_parsed))



        


        return self.link_to_be_parsed
        
        
    
    


    def parsebrainly(self, response):
        #self.log("WWW.BRAINLY.COM ACTIVATED")
        # l = response.xpath('//script[@type ="application/ld+json"]/text()').extract()
        ans =response.xpath("//div[@class='sg-text js-answer-content brn-rich-content']").extract()
        #l_img = response.xpath('//div[@class="brn-main-attachment js-attachment-image-wrapper"]//img').extract()
        #ans = json.loads(l[0])
        #ans["mainEntity"]["acceptedAnswer"][0]["text"]
        


        #imgsrc = response.xpath('//div[@class="brn-main-attachment brn-main-attachment--loading js-attachment-image-wrapper "]/@src').extract()[:2]
        imgsrc = response.xpath("//section[@id='answers']//img[@title='Attachment']/@src").getall()
        
        #self.log("HELLO FROM BRAINL")
        # with open("brainly.txt", "w+") as b:
        #     b.write(str(ans)+ str(imgsrc))

        self.answer["domain"].append("brainly")
        self.answer["answer"].append(ans)
        if imgsrc :
            self.answer["answer"].append(0)
        else:
            self.answer["answer"].append(imgsrc)



        
        self.writetheanswer()
        


        

            

            
        #ans = str(l["mainEntity"]["suggestedAnswer"][0]["text"])
        
        #self.log(self.answer)

            
    """ def downloadImage(self,urll, urllname):
        
        urllib.request.urlretrieve(self.urll, self.urllname) """

    def parseaskiitans(self, response):
        self.log("WWW>ASKIITIANS.COM STARTED")
        # with open("ians.txt", "a+") as f:
        #     self.log("ask")
        #     l = response.xpath(
        #         '//div[@id ="rptAnswers_ctl01_pnlAnswer"]//div').extract()[3][5:-6]
        #     imgsrc = response.xpath(
        #         '//div[@id ="rptAnswers_ctl01_pnlAnswer"]//div//img[@src]').extract()[0]
        #     imgsrc = imgsrc[imgsrc.find('src="')+5:imgsrc.find('.jpg"') + 4]
        #     #downloadImage(imgsrc, "A")
        #     urllib.request.urlretrieve(imgsrc, "img_Ask")
        #     self.log(imgsrc)
        #     f.write(str(l))
        #     f.write(str(imgsrc))
        l = str(response.xpath('//*[@id="rptAnswers_ctl01_pnlAnswer"]').extract())
        l = self.janitor(l)

        
        img = response.xpath('//div[@id="rptAnswers_ctl01_pnlAnswer"]//img/@src').extract()


        self.answer["domain"].append("askiitans")
        self.answer["answer"].append(l)
        if img :
            self.answer["answer"].append(0)
        else:
            self.answer["answer"].append(img)

        

        self.writetheanswer()

        


    def parsedoubtnut(self, response):
        self.log("D FOR DOUBTNUT")
        #with open("hi.txt", "a+") as ff:
         #   ff.write("HELLO")
        
            
        htmls = str(response.text)
        i_ans_text = htmls.find("Answer Text")
        htmls = htmls[i_ans_text:]
           
        p_indexes = [m.start() for m in re.finditer('</p>', htmls)][2]
        half_almost_answer = htmls[:p_indexes]
        ind_almost_answer = half_almost_answer[::-1].find('>')
        answer = half_almost_answer[-ind_almost_answer:]

        self.answer["domain"].append("askiitans")
        self.answer["answer"].append(answer)
        self.answer["answer"].append(0)
        self.writetheanswer()
    def janitor(self,raw_html):

        self.cleanr = re.compile('<.*?>')
        self.cleantext = re.sub(self.cleanr, '', raw_html)
        # self.cleantext = self.cleantext.replace("\\n")
        self.cleantext = re.sub('\\\\xa0','',self.cleantext)
        self.cleantext = re.sub('\\\\[A-Za-z]','',self.cleantext)
        # self.cleantext = re.sub(r'[\\\\\w]', '', self.cleantext)
        self.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO OOOOOO")
        self.log(self.cleantext)
        self.log(type(self.cleantext))
        
        self.cleantext = str(self.cleantext).rstrip(" []'")
        self.cleantext = str(self.cleantext).lstrip("[] '")

        return self.cleantext
            
        
    def writetheanswer(self):
        with open("ans.txt", "w") as f:
            f.write(str(self.answer))