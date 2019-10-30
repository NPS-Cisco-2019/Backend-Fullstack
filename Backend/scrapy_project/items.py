# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class CiscoProjectItem(scrapy.Item):
    domain = scrapy.Field()
    answer = scrapy.Field()
    pass
