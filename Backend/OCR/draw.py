import numpy as np
import cv2

def drawPolygons(drawOn, polygons, ratioWidth, ratioHeight, color=(0, 0, 255), width=1):
    for polygon in polygons:
        pts = np.array(polygon, np.int32)
        pts = pts.reshape((-1, 1, 2))
        # draw the polygon
        cv2.polylines(drawOn, [pts], True, color, width)


def drawBoxes(drawOn, boxes, ratioWidth, ratioHeight, color=(0, 255, 0), width=1):

    for(x,y,w,h) in boxes:
        startX = int(x*ratioWidth)
        startY = int(y*ratioHeight)
        endX = int((x+w)*ratioWidth)
        endY = int((y+h)*ratioHeight)

        # draw the bounding box on the image
        cv2.rectangle(drawOn, (startX, startY), (endX, endY), color, width)
        
 