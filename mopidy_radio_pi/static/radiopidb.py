#!/usr/bin/python
# -*- coding: utf-8 -*-

import sqlite3 as lite
import sys

con = lite.connect('db/radiopi.db')

with con:
    
    with con:
    
		cur = con.cursor()   
		cur.execute("DROP TABLE IF EXISTS Tracklist")
		cur.execute("CREATE TABLE Tracklist(Id INTEGER PRIMARY KEY, TrackUri TEXT, ChosenBy TEXT, DedicatedTo TEXT, Comments TEXT, DateAdded DATE, HostAddress TEXT, UserId INT, Points INT)")
		
		cur.execute("DROP TABLE IF EXISTS TracklistHistory")
		cur.execute("CREATE TABLE TracklistHistory(Id INTEGER PRIMARY KEY, TrackUri TEXT, ChosenBy TEXT, DedicatedTo TEXT, Comments TEXT, DateAdded DATE, HostAddress TEXT, UserId INT, Points INT)")
		
		cur.execute("DROP TABLE IF EXISTS UpVote")
		cur.execute("CREATE TABLE UpVote(Id INTEGER PRIMARY KEY, TrackUri TEXT, Comments TEXT, DateVoted DATE, HostAddress TEXT, UserId INT, UserName TEXT)")
		
		cur.execute("DROP TABLE IF EXISTS DownVote")
		cur.execute("CREATE TABLE DownVote(Id INTEGER PRIMARY KEY, TrackUri TEXT, Comments TEXT, DateVoted DATE, HostAddress TEXT, UserId INT, UserName TEXT)")
		
		cur.execute("DROP TABLE IF EXISTS VoteToSkip")
		cur.execute("CREATE TABLE VoteToSkip(Id INTEGER PRIMARY KEY, TrackUri TEXT, Comments TEXT, DateVoted DATE, HostAddress TEXT, UserId INT, UserName TEXT)")
		
		cur.execute("DROP TABLE IF EXISTS UpToEleven")
		cur.execute("CREATE TABLE UpToEleven(Id INTEGER PRIMARY KEY, TrackUri TEXT, Comments TEXT, DateVoted DATE, HostAddress TEXT, UserId INT, UserName TEXT)")
		
		cur.execute("DROP TABLE IF EXISTS User")
		cur.execute("CREATE TABLE User(Id INTEGER PRIMARY KEY, HostAddress TEXT, UserName TEXT, PiPoints INT, TracksRequested INT, TracksSkipped INT, TracksUpToEleven INT)")
		
		#cur.execute("INSERT INTO Tracklist VALUES(1,'spotify:track:4ollMTGkoG7ytZ7oB9SbyC','pburkinshaw',date('now'))")
		#cur.execute("INSERT INTO Tracklist VALUES(2,'spotify:track:0bVyjkbYDx6QeHrCoHuoxY','anonymous',date('now'))")