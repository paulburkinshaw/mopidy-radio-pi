#!/usr/bin/python
# -*- coding: utf-8 -*-

import sqlite3 as lite
import sys

con = lite.connect('radiopi.db')

with con:
    
    with con:
    
		cur = con.cursor()   
        cur.execute("DROP TABLE IF EXISTS Tracklist")
		cur.execute("CREATE TABLE Tracklist(Id INTEGER PRIMARY KEY, TrackListTitle TEXT, TrackListDescription TEXT, TrackListThemeId INT, TrackListDate DATE)")
		
		cur.execute("DROP TABLE IF EXISTS TracklistTracks")
		cur.execute("CREATE TABLE Tracklist(Id INTEGER PRIMARY KEY, TracklistId INT, TrackTitle TEXT, TrackArtist TEXT, TrackUri TEXT, ChosenBy TEXT, DedicatedTo TEXT, Comments TEXT, DateAdded DATE, Username TEXT)")
		
        cur.execute("DROP TABLE IF EXISTS CurrentTrack")
		cur.execute("CREATE TABLE Tracklist(Id INTEGER PRIMARY KEY, TracklistId INT, TrackUri TEXT)")

        cur.execute("DROP TABLE IF EXISTS TrackComments")
		cur.execute("CREATE TABLE Tracklist(Id INTEGER PRIMARY KEY, TrackUri TEXT, Comments TEXT, Username TEXT, DateAdded DATE,)")
		
        cur.execute("DROP TABLE IF EXISTS TrackListTheme")
		cur.execute("CREATE TABLE Tracklist(Id INTEGER PRIMARY KEY, ThemeTitle TEXT, ThemeDescription TEXT, ThemeAuthor TEXT, DateAdded DATE)")
		
		cur.execute("DROP TABLE IF EXISTS UpVote")
		cur.execute("CREATE TABLE UpVote(Id INTEGER PRIMARY KEY, TrackUri TEXT, TracklistId INT, Comments TEXT, DateVoted DATE, HostAddress TEXT, Username TEXT)")
					
		cur.execute("DROP TABLE IF EXISTS VoteToSkip")
		cur.execute("CREATE TABLE VoteToSkip(Id INTEGER PRIMARY KEY, TrackUri TEXT, TracklistId INT, Comments TEXT, DateVoted DATE, HostAddress TEXT, Username TEXT)")
		
		cur.execute("DROP TABLE IF EXISTS User")
		cur.execute("CREATE TABLE User(Id INTEGER PRIMARY KEY, UserName TEXT, PiPoints INT, TracksRequested INT, TracksSkipVoted INT, TracksSucessfullySkipped INT, TracksLiked INT)")
		
		#cur.execute("INSERT INTO Tracklist VALUES(1,'spotify:track:4ollMTGkoG7ytZ7oB9SbyC','pburkinshaw',date('now'))")
		#cur.execute("INSERT INTO Tracklist VALUES(2,'spotify:track:0bVyjkbYDx6QeHrCoHuoxY','anonymous',date('now'))")