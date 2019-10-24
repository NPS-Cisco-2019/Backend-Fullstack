import os
import requests
import datetime
import json
from bs4 import BeautifulSoup
import re
import tldextract
""" try: 
    from googlesearch import search 
    #os.remove('C:/Users/Anirudh/Desktop/AniC/coding/Python/scrapy/tutorial/.google-cookie')
#except ImportError:  
    print("No module named 'google' found") 
inp = input("Yeet smthing : ")
l =  search(inp, tld='com', lang='en', num=10, stop=1, pause= 5)
with open('links.txt', 'a+') as filee:
    for link in l:
        filee.write(link)
        filee.write(" ")
os.system('scrapy crawl quotespider')
listt = tldextract.extract(url)  
           website = listt.domain
 """
def return_links(user_query):
    '''
    Function takes in a string as a query, 
    and scrapes the links of the top 10 websites 
    for this query on Google.
    Returns: A list of URLs
    '''
    #Initialize empty array to store all links scraped from google query
    links = []
    google_search = "https://www.google.com/search?q=" + user_query
    rq = requests.get(google_search).text 
    urls = re.findall(r'href=[\'"]?([^\'" >]+)', rq)
    useful_domains = ["doubtnut","brainly", "askiitians", "meritnation", "topperlearning", "byjus"]
    jsonfile = {}
    default_username = "bob"
    current_time =  datetime.datetime.now().time()
    jsonfile = {}
    jsonfile["username"] = default_username
    jsonfile["current_time"] = str(current_time)
    jsonfile["link"] = []
    jsonfile["domain"] = []
   #soup = BeautifulSoup(r.text, "html.parser")
    for url in urls:
       print(url)
       url = url[7:url.find(';') -4 ]
       
       if tldextract.extract(url).domain in useful_domains :
           jsonfile["link"].append(str(url))
           jsonfile["domain"].append(str(tldextract.extract(url).domain))
    with open("linkjson.txt", "a+") as jsonf:
        json.dump(jsonfile, jsonf)    
    #If google query is valid and returns 200 status (True)
     #if r.ok:
        #Parse the returned object into an HTML format that bs4 understands
      #  soup = BeautifulSoup(r.text, "html.parser")
        #Go through each item in the google page, and save the green link beneath the
        #page header and append it to the empty list
        #for item in soup.find_all('h3', attrs={'class': 'r'}):
         #   links.append(item.a['href'][7:])
    #If status fails/404 error/page does not load correctly/invalid URL retrieved
    #return links
return_links(input().replace(' ', '+'))
os.system("scrapy crawl answerbot")
input()
