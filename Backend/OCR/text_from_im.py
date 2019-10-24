
import cv2 as cv
import sys, base64, os
import pytesseract
import numpy as np
# from text_cropping import *
sys.path.append(os.path.join(os.getcwd(), "OCR"))
print(sys.path)
import text_cropping
import argparse

def main():
    # construct the argument parser and parse the arguments
    ap = argparse.ArgumentParser()
    ap.add_argument("-i", "--path", type=str,
                    help="path to input image")
    # ap.add_argument("-east", "--east", type=str, default=os.path.join(os.path.dirname(os.path.realpath(__file__)), 'frozen_east_text_detection.pb'),
    #                 help="path to input EAST text detector")
    # ap.add_argument("-c", "--min-confidence", type=float, default=0.5,
    #                 help="minimum probability required to inspect a region")
    # ap.add_argument("-w", "--width", type=int, default=320,
    #                 help="resized image width (should be multiple of 32)")
    # ap.add_argument("-e", "--height", type=int, default=320,
    #                 help="resized image height (should be multiple of 32)")
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

    text_box = cv.cvtColor(text_cropping.get_cropped_image(im), cv.COLOR_BGR2GRAY)

    text_box = cv.GaussianBlur(text_box, (5, 5), 0)

    _, text_box = cv.threshold(
        text_box, 0, 255, cv.THRESH_OTSU+cv.THRESH_BINARY)

    # cv.imshow('TB', text_box)
    cv.waitKey(0)
    # in order to apply Tesseract v4 to OCR text we must supply
    # (1) a language, (2) an OEM flag of 4, indicating that the we
    # wish to use the LSTM neural net model for OCR, and finally
    # (3) an OEM value, in this case, 7 which implies that we are
    # treating the ROI as a single line of text
    config = ("-l eng --oem 1 --psm 4")
    text = pytesseract.image_to_string(text_box, config=config)
    print(text)

def text_from_image(image):

    im = base64_to_cv2_img(image)

    # cv.imshow('Hello', im)

    text_box = text_cropping.get_cropped_image(im)

    if text_box is None:
        return 'TEXT NOT FOUND'
        
    else:
        text_box = cv.cvtColor(text_box, cv.COLOR_BGR2GRAY)

        _, text_box = cv.threshold(
            text_box, 0, 255, cv.THRESH_OTSU+cv.THRESH_BINARY)

        # cv.imshow('TB', text_box)
        cv.waitKey(0)
        # in order to apply Tesseract v4 to OCR text we must supply
        # (1) a language, (2) an OEM flag of 4, indicating that the we
        # wish to use the LSTM neural net model for OCR, and finally
        # (3) an OEM value, in this case, 7 which implies that we are
        # treating the ROI as a single line of text
        config = ("-l eng --oem 1 --psm 4")
        text = pytesseract.image_to_string(text_box, config=config)
        # print(text)
        return text

if __name__ == '__main__':
    main()
