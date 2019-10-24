import math


def rects2polys(rects, thetas, origins, ratioWidth=1, ratioHeight=1):
    """Convert rectangles (x,y, w, h) into polygons [(x0,y0), (x1, y1), (x2, y2), (x3, y3])

    :param rects: a list of rectangles, each specified as (x, y, w, h)
    :type rects: tuple
    :param thetas: the angle of rotation for each rectangle in radians
    :type theta: list of float
    :param origin: the point to rotate each rectangle around
    :type origin: list of tuple
    :param ratioWidth: optional width scaling factor, default 1.0
    :type ratioWidth: float
    :param ratioHeight: optional height scaling factor, default 1.0
    :type ratioHeight: float
    :return: a list of polygons, each specified by its (x,y) verticies
    :rtype: list
    """
    polygons = []
    for i, box in enumerate(rects):
        upperLeftX = box[0]
        upperLeftY = box[1]
        lowerRightX = box[0] + box[2]
        lowerRightY = box[1] + box[3]

        # scale the bounding box coordinates based on the respective ratios
        upperLeftX = int(upperLeftX * ratioWidth)
        upperLeftY = int(upperLeftY * ratioHeight)
        lowerRightX = int(lowerRightX * ratioWidth)
        lowerRightY = int(lowerRightY * ratioHeight)

        # create an array of the rectangle's verticies
        points = [
            (upperLeftX, upperLeftY),
            (lowerRightX, upperLeftY),
            (lowerRightX, lowerRightY),
            (upperLeftX, lowerRightY)
        ]

        # the offset is the point at which the rectangle is rotated
        rotationPoint = (int(origins[i][0] * ratioWidth), int(origins[i][1] * ratioHeight))

        polygons.append(rotatePoints(points, thetas[i], rotationPoint))

    return polygons


def rotatePoints(points, theta, origin):
    """Rotate the list of points theta radians around origin

    :param points: list of points, each given as (x,y)
    :type points:  tuple
    :param theta: the angle to rotate the points in radians
    :type theta: float
    :param origin: the point about which the points are to be rotated
    :type origin: tuple
    :return: list of rotated points
    :rtype: list
    """
    rotated = []
    for xy in points:
        rotated.append(rotate_around_point(xy, theta, origin))

    return rotated


def rotate_around_point(xy, radians, origin=(0, 0)):
    """Rotate a point around a given point.

    Adapted from `LyleScott/rotate_2d_point.py` <https://gist.github.com/LyleScott/e36e08bfb23b1f87af68c9051f985302>`_

    :param xy: the (x,y) point to rotate
    :type xy: tuple
    :param radians: the angle in radians to rotate
    :type radians: float
    :param origin: the point to rotate around, defaults to (0,0)
    :returns: the rotated point
    """
    x, y = xy
    offset_x, offset_y = origin
    adjusted_x = (x - offset_x)
    adjusted_y = (y - offset_y)
    cos_rad = math.cos(radians)
    sin_rad = math.sin(radians)
    qx = offset_x + cos_rad * adjusted_x + sin_rad * adjusted_y
    qy = offset_y + -sin_rad * adjusted_x + cos_rad * adjusted_y

    return qx, qy