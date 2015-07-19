﻿from __future__ import unicode_literals

import logging
import os

import tornado.locale
import tornado.web
import tornado.websocket
import json
import urlparse
import csv
import codecs


def GetDict(filename):
    # load users from csv file into dict
    dict = {}
    path = os.path.dirname(os.path.realpath(__file__))
    with open(path + '/' + filename, 'rb') as f:
        reader = csv.reader(f, delimiter=str(u','))
        for row in reader:
            if len(row):
                if row[0].startswith(codecs.BOM_UTF8):
                    row[0] = row[0][3:]
                    dict[row[0]] = row[1]
                else:
                    dict[row[0]] = row[1]
    return dict

       

