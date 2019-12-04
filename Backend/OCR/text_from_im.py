import cv2 as cv
import sys, base64, os
import pytesseract
import numpy as np
# from text_cropping import *
sys.path.append(os.path.join(os.getcwd(), "OCR"))
print(sys.path)
import text_cropping
from config import *
import argparse


def main():
    # construct the argument parser and parse the arguments
    ap = argparse.ArgumentParser()
    ap.add_argument("-i", "--path", type=str,
                    help="path to input image")
    args = vars(ap.parse_args())

    # get_cropped_image(image=args["image"])
    text_from_image_path(args['path'])


def base64_to_cv2_img(uri):
    encoded_data = uri.split(',')[1]
    nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    img = cv.imdecode(nparr, cv.IMREAD_COLOR)
    return img

def text_from_image_path(image_path):

    im = cv.imread(image_path)

    text_box = text_cropping.get_cropped_image(im)

    if text_box is None:
        return 'TEXT NOT FOUND'
        
    else:
        text_box = cv.cvtColor(text_box, cv.COLOR_BGR2GRAY)

        _, text_box = cv.threshold(text_box, 0, 255, cv.THRESH_OTSU + cv.THRESH_BINARY)
        # text_box = cv.adaptiveThreshold(text_box, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, min(text_box.shape[:2]), 0)

        if TESTING:
            cv.imshow('TB', text_box)
            cv.waitKey(0)

        config = ("-l eng --oem 1 --psm 4")
        text = pytesseract.image_to_string(text_box, config=config)
        log(text)
        return text

def text_from_image(image):

    initLog()

    im = base64_to_cv2_img(image)

    text_box = text_cropping.get_cropped_image(im)

    if text_box is None:
        return 'TEXT NOT FOUND'
        
    else:
        text_box = cv.cvtColor(text_box, cv.COLOR_BGR2GRAY)

        _, text_box = cv.threshold(
            text_box, 0, 255, cv.THRESH_OTSU+cv.THRESH_BINARY)

        if TESTING:
            cv.imshow('TB', text_box)
            cv.waitKey(0)
        # in order to apply Tesseract v4 to OCR text we must supply
        # (1) a language, (2) an OEM flag of 4, indicating that the we
        # wish to use the LSTM neural net model for OCR, and finally
        # (3) an OEM value, in this case, 7 which implies that we are
        # treating the ROI as a single line of text
        config = ("-l eng --oem 1 --psm 4")
        text = pytesseract.image_to_string(text_box, config=config)
        log(text)
        return text

if __name__ == '__main__':
    main()
