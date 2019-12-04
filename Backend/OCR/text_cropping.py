# import the necessary packages
import argparse
import os
import time

import cv2 as cv
from nms import nms
from math import *
from matplotlib import pyplot as plt
import numpy as np

from config import *

from opencv_text_detection import utils
from opencv_text_detection.decode import decode
from opencv_text_detection.draw import drawPolygons, drawBoxes

# SECTION Main Function
def get_cropped_image(image, east='frozen_east_text_detection.pb', min_confidence=0.5, width=320, height=320):

    log('[LM] Cropping Begun:')

    if TESTING:
        cv.imshow('INPUT', image)
        cv.waitKey(0)

    image = normalizeImageSize(image)
    (h, w) = image.shape[:2]
    orig = image.copy()

    # Constants
    confidenceThreshold = min_confidence
    nmsThreshold = 0.4
    tb_padding = 0.1
    bb_padding = [0.005, 0.05]
    theta_thresh = 2
    m = 3

    log('[LM] Get scores 1')

    image = normalizeImageSize(image)

    (rects, confidences, baggage) = get_scores(image, east)

    log('[LM] Get scores 1 END')

    offsets = []
    thetas = []
    for b in baggage:
        offsets.append(b['offset'])
        thetas.append(b['angle'])

    incl = np.array(thetas)

    log('[DATA] Initital mean: ', degrees(np.mean(incl)))

    if incl.size == 0:
        log('[ERROR] No theta found in included', thetas)
        return None

    theta, std = np.mean(incl), np.std(incl)
    incl = incl[abs(incl-theta)/std <= m]
    theta = np.mean(incl)

    if degrees(theta) < theta_thresh:
        theta = 0

    if TESTING:
        plt.plot(incl)
        plt.show()

    log('[DATA] Updated Theta:', degrees(theta))
    log('[DATA] Inclinations and theta: ')
    log('THETAS:', len(np.array(thetas)))
    log('INCL: ', len(incl))

    res = rotate_image(orig.copy(), theta)

    if TESTING:
        cv.imshow('TEST', res)
        cv.waitKey(0)

    drawOn = orig.copy()

    # TODO: Delete this
    function = nms.felzenszwalb.nms
    indicies = nms.boxes(rects, confidences, nms_function=function, confidence_threshold=confidenceThreshold,
                         nsm_threshold=nmsThreshold)
    
    drawrects = np.array(rects)[indicies]

    drawBoxes(drawOn, drawrects, 1, 1, (0, 255, 0), 2)

    if TESTING:
        cv.imshow('DRAW', drawOn)
        cv.waitKey(0)

    log('[LM] Get scores 2')

    res = normalizeImageSize(res)

    (rects, confidences, baggage) = get_scores(res, east)

    log('[LM] Get scores 2 END')

    function = nms.felzenszwalb.nms
    start = time.time()
    indicies = nms.boxes(rects, confidences, nms_function=function, confidence_threshold=confidenceThreshold,
                         nsm_threshold=nmsThreshold)
    end = time.time()

    indicies = np.array(indicies).reshape(-1)
    drawrects = np.array(rects)[indicies]
    name = function.__module__.split('.')[-1].title()
    log("[INFO] {} NMS took {:.6f} seconds and found {} boxes".format(
        name, end - start, len(drawrects)))

    drawOn = res.copy()
    drawBoxes(drawOn, drawrects, 1, 1, (0, 255, 0), 2)

    if TESTING:
        cv.imshow('DRAWON AFTER ROTATION', drawOn)
        cv.waitKey(0)

    h, w = res.shape[:2]

    uLim = lambda x, m: x if x < m else m
    lLim = lambda x: x if x > 0 else 0 

    drawrects = removeExtremes(drawrects)

    bb_coords = [int(min(drawrects[:, 0])), int(min(
        drawrects[:, 1])), int(max(drawrects[:, 0] + (1+tb_padding)*drawrects[:, 2])), int(max(drawrects[:, 1] + (1+tb_padding)*drawrects[:, 3]))]
    bb_w = bb_coords[3] - bb_coords[1]
    bb_h = bb_coords[2] - bb_coords[0]


    text_box = res[lLim(bb_coords[1]-int(h*bb_padding[1]/2)):uLim(bb_coords[3] +
                   int(h*bb_padding[1]/2), h), lLim(bb_coords[0]-int(w*bb_padding[0]/2)):uLim(bb_coords[2]+int(w*bb_padding[0]/2), w)]

    if text_box.size == 0:
        log('[ERROR] Textbox not found')
        return None

    if TESTING:
        cv.imshow("Final Cropping", text_box)
        cv.waitKey(0)

    return text_box
# !SECTION 

# SECTION Helper Code

def text_detection_command():
    # construct the argument parser and parse the arguments
    ap = argparse.ArgumentParser()
    ap.add_argument("-i", "--image", type=str,
                    help="path to input image")
    args = vars(ap.parse_args())

    get_cropped_image(cv.imread(args["image"]))

def N(u, s, x):
    return np.exp(-(x-u)**2/s**2)

def removeExtremes(drawrects):
    y = drawrects[:, 1]
    log('[DATA] Bounding boxes Before: ', len(drawrects))
    drawrects = drawrects[N(np.mean(y), np.std(y), y) > p_thresh]
    log('[DATA] Bounding boxes After: ', len(drawrects))
    return drawrects

def rotate_image(mat, angle):

    height, width = mat.shape[:2]
    image_center = (width/2, height/2)
    rotation_mat = np.array([[cos(angle), -sin(angle), 0], [sin(angle), cos(angle), 0]])

    abs_cos = abs(rotation_mat[0,0])
    abs_sin = abs(rotation_mat[0,1])

    bound_w = int(height * abs_sin + width * abs_cos)
    bound_h = int(height * abs_cos + width * abs_sin)

    rotation_mat[0, 2] += bound_w/2 - image_center[0]
    rotation_mat[1, 2] += bound_h/2 - image_center[1]

    rotated_mat = cv.warpAffine(mat, rotation_mat, (bound_w, bound_h))
    return rotated_mat

def normalizeImageSize(image):
    h, w = image.shape[:2]
    if h*w < 512*512:
        k = ((512*512)/(h*w))**0.5
    else:
        k = 1
    rH, rW = (32*round(k*h/32), 32*round(k*w/32))

    image = cv.resize(image, (rW, rH), interpolation=cv.INTER_CUBIC)

    return image


def get_scores(image, east='frozen_east_text_detection.pb', min_confidence=0.5, width=320, height=320):

    if TESTING:
        cv.imshow('SCORES INPUT', image)

    (imageHeight, imageWidth) = image.shape[:2]

    layerNames = [
        "feature_fusion/Conv_7/Sigmoid",
        "feature_fusion/concat_3"]

    # load the pre-trained EAST text detector
    log("[INFO] loading EAST text detector...")

    log('east:',east)
    net = cv.dnn.readNetFromTensorflow(east)

    blob = cv.dnn.blobFromImage(
        image, 1.0, (imageWidth, imageHeight), (123.68, 116.78, 103.94), swapRB=True, crop=False)

    start = time.time()
    net.setInput(blob)

    (scores, geometry) = net.forward(layerNames)

    end = time.time()

    log("[INFO] text detection took {:.6f} seconds".format(end - start))

    confidenceThreshold = min_confidence

    return decode(scores, geometry, confidenceThreshold)
# !SECTION 

if __name__ == '__main__':
    text_detection_command()
