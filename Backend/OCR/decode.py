import numpy as np
import cv2

#
# rects are rectangles encoded as [x, y, w, h] and used predominately by openCV
# boxes are rectangles encoded as [ulx, uly, lrx, lry]
#
#
#
# returns:
#   rects -- an array of [x, y, w, h] that describe rectangles
#   confidences -- an array of floats correstponding to each rectangle in rects
#   baggage -- an array of dictionaries that contain info about each rect including its offset and angle
#
def decode(scores, geometry, confidenceThreshold):
    
    # grab the number of rows and columns from the scores volume, then
    # initialize our set of bounding box rectangles and corresponding confidence scores
    (numRows, numCols) = scores.shape[2:4]
    confidences = []    
    rects = [] #(x,y,w,h)
    baggage =[]

    # loop over the number of rows
    for y in range(0, numRows):
        # extract the scores (probabilities), followed by the geometrical
        # data used to derive potential bounding box coordinates that
        # surround text
        scoresData = scores[0, 0, y]
        dTop =          geometry[0, 0, y]
        dRight =        geometry[0, 1, y]
        dBottom =       geometry[0, 2, y]
        dLeft =         geometry[0, 3, y]
        anglesData =    geometry[0, 4, y]
            
        # loop over the number of columns
        for x in range(0, numCols):
        
            # if our score does not have sufficient probability, ignore it
            if scoresData[x] < confidenceThreshold:
                continue
    
            confidences.append(float(scoresData[x]))
    
            # compute the offset factor as our resulting feature maps will
            # be 4x smaller than the input image
            (offsetX, offsetY) = (x * 4.0, y * 4.0)
                
            # extract the rotation angle for the prediction and then
            angle = anglesData[x]
                                        
            # offsetX|Y is where the dTop, dRight, dBottom and dLeft are measured from
            # calc the rect corners
            upperRight = (offsetX + dRight[x], offsetY - dTop[x])
            lowerRight = (offsetX + dRight[x], offsetY + dBottom[x])
            upperLeft = (offsetX - dLeft[x], offsetY - dTop[x])
            lowerLeft = (offsetX - dLeft[x], offsetY + dBottom[x])

            rects.append([
                int(upperLeft[0]), # x
                int(upperLeft[1]),  # y
                int(lowerRight[0]-upperLeft[0]), # w
                int(lowerRight[1]-upperLeft[1]) # h
            ])
            
            baggage.append({
                "offset": (offsetX, offsetY),
                "angle": anglesData[x],
                "upperRight": upperRight,
                "lowerRight": lowerRight,
                "upperLeft": upperLeft,
                "lowerLeft": lowerLeft,
                "dTop": dTop[x],
                "dRight": dRight[x],
                "dBottom": dBottom[x],
                "dLeft": dLeft[x]
            })
    
    return (rects, confidences, baggage)
                 

#
# returns:
#   boxes - an array of rects defined by (ulx, uly, lrx, lry)
#   confidences - an array of floats associated with each rect
#
def decodeBoundingBoxes(scores, geometry, confidenceThreshold):
    
    from geom import rotatePoints

    (numRows, numCols) = scores.shape[2:4]
    boxes = []
    confidences = []
    
    for y in range(0, numRows):
        # extract the scores (probabilities), followed by the geometrical
        # data used to derive potential bounding box coordinates that
        # surround text
        scoresData = scores[0, 0, y]
        dTop = geometry[0, 0, y]
        dRight = geometry[0, 1, y]
        dBottom = geometry[0, 2, y]
        dLeft = geometry[0, 3, y]
        anglesData = geometry[0, 4, y]
        
        # loop over the columns
        for x in range(0, numCols):
            # if our score does not have sufficient probability, ignore it
            if scoresData[x] < confidenceThreshold:
                continue
    
            confidences.append(float(scoresData[x]))
            
            # compute the offset factor as our resulting feature maps will
            # be 4x smaller than the input image
            (offsetX, offsetY) = (x * 4.0, y * 4.0)
                
            # extract the rotation angle for the prediction and then
            theta = anglesData[x]
            
            # using the offsets and distances, calculate the corners of the rect
            upperRight = (offsetX + dRight[x], offsetY - dTop[x])
            lowerRight = (offsetX + dRight[x], offsetY + dBottom[x])
            upperLeft = (offsetX - dLeft[x], offsetY - dTop[x])
            lowerLeft = (offsetX - dLeft[x], offsetY + dBottom[x])
            
            points = [upperRight, lowerRight, upperLeft, lowerLeft]
            
            rotatedPoints = rotatePoints(points, theta, (offsetX, offsetY))
            
            boundingRect = cv2.boundingRect(np.array(rotatedPoints, dtype=np.float32))
            
            # boundingRect is x, y, w, h, convert to upperLeft and lowerRight
            boxes.append([
                int(boundingRect[0]),
                int(boundingRect[1]), 
                int(boundingRect[0]+boundingRect[2]), 
                int(boundingRect[1]+boundingRect[3])
            ])
            
    return boxes, confidences

        
#
# returns:
#   boxes - an array of rects defined by (upperLeftX, upperLeftY, lowerLeftX, lowerLeftY)
#   confidences - an array of confidences associated with each rect in rects
#   baggage -- an array of dictionaries that contain info about each rect including its offset and angle
#             
def pisDecode(scores, geometry, confidenceThreshold):
    
    (numRows, numCols) = scores.shape[2:4]
    boxes = []
    confidences = []    
    baggage =[]
    
    # loop over the number of rows
    for y in range(0, numRows):
        # extract the scores (probabilities), followed by the geometrical
        # data used to derive potential bounding box coordinates that
        # surround text
        scoresData = scores[0, 0, y]
        dTop = geometry[0, 0, y]
        dRight = geometry[0, 1, y]
        dBottom = geometry[0, 2, y]
        dLeft = geometry[0, 3, y]
        anglesData = geometry[0, 4, y]
            
        # loop over the number of columns
        for x in range(0, numCols):
        
            # if our score does not have sufficient probability, ignore it
            if scoresData[x] < confidenceThreshold:
                continue
    
            confidences.append(float(scoresData[x]))
    
            # compute the offset factor as our resulting feature maps will
            # be 4x smaller than the input image
            (offsetX, offsetY) = (x * 4.0, y * 4.0)
                
            # extract the rotation angle for the prediction and then
            # compute the sin and cosine
            angle = anglesData[x]
            cos = np.cos(angle)
            sin = np.sin(angle)
                            
            # use the geometry volume to derive the width and height of
            # the bounding box
            h = dTop[x] + dBottom[x]
            w = dRight[x] + dLeft[x]
    
            # compute both the starting and ending (x, y)-coordinates for
            # the text prediction bounding box
            endX = int(offsetX + (cos * dRight[x]) + (sin * dBottom[x]))
            endY = int(offsetY - (sin * dRight[x]) + (cos * dBottom[x]))
            startX = int(endX - w)
            startY = int(endY - h)
            
            # add the bounding box coordinates and probability score to
            # our respective lists
            boxes.append((startX, startY, endX, endY))
            
            baggage.append({
                "offset": (offsetX, offsetY),
                "angle": anglesData[x],
                "upperRight": (offsetX + dRight[x], offsetY - dTop[x]),
                "lowerRight": (offsetX + dRight[x], offsetY + dBottom[x]),
                "upperLeft": (offsetX - dLeft[x], offsetY - dTop[x]),
                "lowerLeft": (offsetX - dLeft[x], offsetY + dBottom[x]),
                "dTop": dTop[x],
                "dRight": dRight[x],
                "dBottom": dBottom[x],
                "dLeft": dLeft[x]
            })
                 
    return (boxes, confidences, baggage)     
    