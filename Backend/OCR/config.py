import numpy as numpy
import cv2 as cv
import pytesseract
import sys, base64, os

TESTING = False
p_thresh = 0.001

def fileLog(*vals):
    with open('OCR_progress_log.txt', 'a+') as f: 
        f.write(''.join(str(elem) for elem in vals) + '\n')

if TESTING:
    log = print
else:
    log = fileLog


def initLog():
    open('OCR_progress_log.txt', 'w').close()

sys.path.append(os.path.join(os.getcwd(), "OCR"))

# NOTE Uncomment if running on windows
# pytesseract.pytesseract.tesseract_cmd = r"C:\Users\Student\AppData\Local\Tesseract-OCR\tesseract.exe"

