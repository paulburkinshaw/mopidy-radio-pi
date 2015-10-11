#!/usr/bin/python
# -*- coding: utf-8 -*-

import sqlite3 as lite
import sys

con = lite.connect('radiopi.db')

with con:
    cur = con.cursor()
    cur.execute("insert into Tracklist (ThemeId, PlaylistUri, TrackListTitle, TrackListDescription, TrackListImage, TracklistUser, TrackListDate, IsCurrent) values (1, '', 'Default Tracklist', 'Default Tracklist Description', 'DefaultTracklistImg.jpg','admin', date('now'), 1)")	

   