# import the necessary packages
import argparse
import os
import time

import cv2 as cv
from nms import nms
from math import degrees
import numpy as np

from opencv_text_detection import utils
from opencv_text_detection.decode import decode
from opencv_text_detection.draw import drawPolygons, drawBoxes


def get_cropped_image(image, east='frozen_east_text_detection.pb', min_confidence=0.5, width=320, height=320):

    orig = image.copy()
    (h, w) = orig.shape[:2]

    ratioWidth, ratioHeight = w/width, h/height

    # Constants
    confidenceThreshold = min_confidence
    nmsThreshold = 0.4
    tb_padding = 0.1
    bb_padding = [0.005, 0.05]
    m = 3

    (rects, confidences, baggage) = get_scores(orig)

    offsets = []
    thetas = []
    for b in baggage:
        offsets.append(b['offset'])
        thetas.append(b['angle'])

    incl = np.array(thetas)
    if incl.size == 0:
        return None
    theta, std = np.mean(incl), np.std(incl)
    incl = incl[abs(incl-theta)/std <= m]
    theta = np.mean(incl)
    print('[DATA] Updated Theta:  {:.4f}'.format(degrees(theta)))
    print('[DATA] Inclinations and theta: ')
    print('THETAS:', len(np.array(thetas)))
    print('INCL: ', len(incl))

    res = cv.warpAffine(orig.copy(), cv.getRotationMatrix2D(
        (w/2, h/2), -degrees(theta), 1), (w, h))

    (rects, confidences, baggage) = get_scores(res)

    function = nms.felzenszwalb.nms
    start = time.time()
    indicies = nms.boxes(rects, confidences, nms_function=function, confidence_threshold=confidenceThreshold,
                         nsm_threshold=nmsThreshold)
    end = time.time()

    indicies = np.array(indicies).reshape(-1)
    print(indicies)
    drawrects = np.array(rects)[indicies]
    name = function.__module__.split('.')[-1].title()
    print("[INFO] {} NMS took {:.6f} seconds and found {} boxes".format(
        name, end - start, len(drawrects)))

    drawOn = res.copy()
    drawBoxes(drawOn, drawrects, ratioWidth, ratioHeight, (0, 255, 0), 2)

    bb_coords = [int(ratioWidth*min(drawrects[:, 0])), int(ratioHeight*min(
        drawrects[:, 1])), int(ratioWidth*max(drawrects[:, 0] + (1+tb_padding)*drawrects[:, 2])), int(ratioHeight*max(drawrects[:, 1] + (1+tb_padding)*drawrects[:, 3]))]
    bb_w = bb_coords[3] - bb_coords[1]
    bb_h = bb_coords[2] - bb_coords[0]

    text_box = res[bb_coords[1]-int(h*bb_padding[1]/2):bb_coords[3] +
                   int(h*bb_padding[1]/2), bb_coords[0]-int(w*bb_padding[0]/2):bb_coords[2]+int(w*bb_padding[0]/2)]

    # cv.imshow("Final Cropping", text_box)
    # cv.waitKey(0)
    return text_box


def text_detection_command():
    # construct the argument parser and parse the arguments
    ap = argparse.ArgumentParser()
    ap.add_argument("-i", "--image", type=str,
                    help="path to input image")
    args = vars(ap.parse_args())

    get_cropped_image(cv.imread(args["image"]))


def get_scores(image, east='frozen_east_text_detection.pb', min_confidence=0.5, width=320, height=320):
    # image = cv.imread(image, 1)
    orig = image.copy()
    (origHeight, origWidth) = image.shape[:2]

    (newW, newH) = (width, height)
    ratioWidth = origWidth / float(newW)
    ratioHeight = origHeight / float(newH)

    image = cv.resize(image, (newW, newH))
    (imageHeight, imageWidth) = image.shape[:2]

    layerNames = [
        "feature_fusion/Conv_7/Sigmoid",
        "feature_fusion/concat_3"]

    # load the pre-trained EAST text detector
    print("[INFO] loading EAST text detector...")

    print('east:',east)
    net = cv.dnn.readNetFromTensorflow(east)

    blob = cv.dnn.blobFromImage(
        image, 1.0, (imageWidth, imageHeight), (123.68, 116.78, 103.94), swapRB=True, crop=False)

    start = time.time()
    net.setInput(blob)

    (scores, geometry) = net.forward(layerNames)

    end = time.time()

    print("[INFO] text detection took {:.6f} seconds".format(end - start))

    confidenceThreshold = min_confidence
    nmsThreshold = 0.4

    return decode(scores, geometry, confidenceThreshold)


if __name__ == '__main__':
    text_detection_command()
