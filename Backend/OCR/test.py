import argparse
import os
import time

import cv2 as cv;
from nms import nms;
from math import degrees, sin, cos
from matplotlib import pyplot as plt
import numpy as np

from config import *
from text_from_im import text_from_image_path

initLog()
for i in range(1, 100):
    try:
        log(f'[{i}]')
        image_path = str(i)+'.png'
        text_from_image_path(os.path.join(os.getcwd(), 'images/'+image_path))
    except Exception as e:
        print(e)
        break