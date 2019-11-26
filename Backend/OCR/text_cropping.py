# import the necessary packages
import argparse
import os
import time

import cv2 as cv
from nms import nms
from math import degrees, sin, cos
# from matplotlib import pyplot as plt
import numpy as np

from opencv_text_detection import utils
from opencv_text_detection.decode import decode
from opencv_text_detection.draw import drawPolygons, drawBoxes


def get_cropped_image(image, east='frozen_east_text_detection.pb', min_confidence=0.5, width=320, height=320):

    print('[LM] Cropping Begun:')

    # cv.imshow('INPUT', image)
    # cv.waitKey(0)

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

    print('[LM] Get scores 1')

    (rects, confidences, baggage) = get_scores(image, east)

    print('[LM] Get scores 1 END')

    offsets = []
    thetas = []
    for b in baggage:
        offsets.append(b['offset'])
        thetas.append(b['angle'])

    incl = np.array(thetas)

    print('[DATA] Initital mean: ', degrees(np.mean(incl)))

    if incl.size == 0:
        print('[ERROR] No theta found in included', thetas)
        return None

    theta, std = np.mean(incl), np.std(incl)
    incl = incl[abs(incl-theta)/std <= m]
    theta = np.mean(incl)

    if theta < theta_thresh:
        theta = 0

    # plt.plot(incl)
    # plt.show()

    print('[DATA] Updated Theta:', degrees(theta))
    print('[DATA] Inclinations and theta: ')
    print('THETAS:', len(np.array(thetas)))
    print('INCL: ', len(incl))

    res = rotate_image(orig.copy(), theta)

    # cv.imshow('TEST', res)
    # cv.waitKey(0)

    drawOn = orig.copy()

    # TODO: Delete this
    function = nms.felzenszwalb.nms
    indicies = nms.boxes(rects, confidences, nms_function=function, confidence_threshold=confidenceThreshold,
                         nsm_threshold=nmsThreshold)
    
    drawrects = np.array(rects)[indicies]


    drawBoxes(drawOn, drawrects, 1, 1, (0, 255, 0), 2)

    # cv.imshow('DRAW', drawOn)
    # cv.waitKey(0)

    print('[LM] Get scores 2')

    (rects, confidences, baggage) = get_scores(res, east)

    print('[LM] Get scores 2 END')

    function = nms.felzenszwalb.nms
    start = time.time()
    indicies = nms.boxes(rects, confidences, nms_function=function, confidence_threshold=confidenceThreshold,
                         nsm_threshold=nmsThreshold)
    end = time.time()

    indicies = np.array(indicies).reshape(-1)
    drawrects = np.array(rects)[indicies]
    name = function.__module__.split('.')[-1].title()
    print("[INFO] {} NMS took {:.6f} seconds and found {} boxes".format(
        name, end - start, len(drawrects)))

    drawOn = res.copy()
    drawBoxes(drawOn, drawrects, 1, 1, (0, 255, 0), 2)

    # cv.imshow('DRAWON AFTER ROTATION', drawOn)
    # cv.waitKey(0)

    bb_coords = [int(min(drawrects[:, 0])), int(min(
        drawrects[:, 1])), int(max(drawrects[:, 0] + (1+tb_padding)*drawrects[:, 2])), int(max(drawrects[:, 1] + (1+tb_padding)*drawrects[:, 3]))]
    bb_w = bb_coords[3] - bb_coords[1]
    bb_h = bb_coords[2] - bb_coords[0]

    text_box = res[bb_coords[1]-int(h*bb_padding[1]/2):bb_coords[3] +
                   int(h*bb_padding[1]/2), bb_coords[0]-int(w*bb_padding[0]/2):bb_coords[2]+int(w*bb_padding[0]/2)]

    # if not(text_box):
    #     return None

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


def rotate_image(mat, angle):
    # angle in degrees

    height, width = mat.shape[:2]
    image_center = (width/2, height/2)

    # rotation_mat = cv.getRotationMatrix2D(image_center, degrees(angle), 1.)
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

    image = cv.resize(image, (rW, rH))

    return image


def get_scores(image, east='frozen_east_text_detection.pb', min_confidence=0.5, width=320, height=320):
    # image = cv.imread(image, 1)
    (origHeight, origWidth) = image.shape[:2]

    image = normalizeImageSize(image)

    # cv.imshow('SCORES INPUT', image)



    # rH, rW = (32*int(h/32), 32*int(w/32))

    # (newW, newH) = (width, height)
    # ratioWidth = origWidth / float(newW)
    # ratioHeight = origHeight / float(newH)

    # image = cv.resize(image, (newW, newH))
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
