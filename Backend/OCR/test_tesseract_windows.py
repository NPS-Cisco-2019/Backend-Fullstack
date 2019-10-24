from PIL import Image
import pytesseract
import argparse
import cv2
import os


image = cv2.imread("2.jpg")
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
 

gray = cv2.medianBlur(gray, 3)
pytesseract.pytesseract.tesseract_cmd = r"C:\Users\Student\AppData\Local\Tesseract-OCR\tesseract.exe"
text = pytesseract.image_to_string(Image.open(os.path.join(os.getcwd(), "2.jpg")))
print(text)
