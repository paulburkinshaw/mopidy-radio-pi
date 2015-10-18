#!/usr/bin/python
# -*- coding: utf-8 -*-

import sqlite3 as lite
import sys

con = lite.connect('radiopi.db')

with con:
    cur = con.cursor()
    #cur.execute("DROP TABLE IF EXISTS Tracklist")
    #cur.execute("CREATE TABLE Tracklist(Id INTEGER PRIMARY KEY, ThemeId INT, PlaylistUri TEXT, TrackListTitle TEXT, TrackListDescription TEXT, TrackListImage TEXT, TracklistUser TEXT, TrackListDate DATE, IsCurrent INT)")
    #cur.execute("DROP TABLE IF EXISTS TracklistTracks")
    #cur.execute("CREATE TABLE TracklistTracks(Id INTEGER PRIMARY KEY, TracklistId INT, PlaylistUri TEXT, UserProfileId INT, TrackTitle TEXT, TrackArtist TEXT, TrackAlbum TEXT, TrackUri TEXT, ChosenBy TEXT, DedicatedTo TEXT, Comments TEXT, DateAdded DATE, Username TEXT, BeenPlayed INT, OnHold INT)")
    #cur.execute("DROP TABLE IF EXISTS CurrentTrack")
    #cur.execute("CREATE TABLE CurrentTrack(Id INTEGER PRIMARY KEY, TrackId INT, TracklistId INT, TrackUri TEXT)")      
    #cur.execute("DROP TABLE IF EXISTS TrackComments")
    #cur.execute("CREATE TABLE TrackComments(Id INTEGER PRIMARY KEY, TrackId INT, TrackUri TEXT, UserProfileId INT, Username TEXT, Comments TEXT, DateAdded DATE)")
    cur.execute("DROP TABLE IF EXISTS TrackLikes")
    cur.execute("CREATE TABLE TrackLikes(Id INTEGER PRIMARY KEY, TrackId INT, TrackUri TEXT, TrackTitle TEXT, TrackArtist TEXT, TrackAlbum TEXT, TracklistId INT, UserProfileId INT, Username TEXT, Comments TEXT, DateLiked DATE, HostAddress TEXT)")
    #cur.execute("DROP TABLE IF EXISTS TrackSkips")
    #cur.execute("CREATE TABLE TrackSkips(Id INTEGER PRIMARY KEY, TrackId INT, TrackUri TEXT, TracklistId INT, UserProfileId INT, Username TEXT, Comments TEXT, DateSkipped DATE, HostAddress TEXT)")
    #cur.execute("DROP TABLE IF EXISTS UserProfile")
    #cur.execute("CREATE TABLE UserProfile(Id INTEGER PRIMARY KEY, UserName TEXT, Password TEXT, FirstName TEXT, Surname TEXT, Email TEXT, NickName TEXT, Bio TEXT, ProfilePicture TEXT, Vibes INT, LevelId INT, TracksRequested INT, TracksSkipped INT, TracksSucessfullySkipped INT, TracksLiked INT, Enabled INT, PermissionLevel INT)")
    #cur.execute("DROP TABLE IF EXISTS RequestedTracks")
    #cur.execute("CREATE TABLE RequestedTracks(Id INTEGER PRIMARY KEY, TracklistId INT, TrackId INT, UserProfileId INT, Username TEXT, PlaylistUri TEXT, TrackTitle TEXT, TrackArtist TEXT, TrackUri TEXT, ChosenBy TEXT, DedicatedTo TEXT, Comments TEXT, DateAdded DATE, BeenPlayed INT, OnHold INT)")
    #cur.execute("DROP TABLE IF EXISTS FavouriteTracks")
    #cur.execute("CREATE TABLE FavouriteTracks(Id INTEGER PRIMARY KEY, UserProfileId INT, Username TEXT, TrackUri TEXT, TrackTitle TEXT, TrackArtist TEXT, DateAdded DATE)")
    #cur.execute("DROP TABLE IF EXISTS Level")
    #cur.execute("CREATE TABLE Level(Id INTEGER PRIMARY KEY, LevelName TEXT, LevelDescription TEXT, LevelIcon TEXT, VibesRequired INT, TracksAllowed INT, VotePower INT, SkipPower INT)")
    #cur.execute("DROP TABLE IF EXISTS Theme")
    #cur.execute("CREATE TABLE Theme(Id INTEGER PRIMARY KEY, ThemeTitle TEXT, ThemeDescription TEXT, ThemeImage TEXT)")
    #cur.execute("DROP TABLE IF EXISTS ThemeBanners")
    #cur.execute("CREATE TABLE ThemeBanners(Id INTEGER PRIMARY KEY, ThemeId INT, BannerImageFileName TEXT, BannerImagePath TEXT, DateAdded DATE)")
    #cur.execute("DROP TABLE IF EXISTS UserNotifications")
    #cur.execute("CREATE TABLE UserNotifications(Id INTEGER PRIMARY KEY, UserProfileId INT, UserName TEXT, NotificationText TEXT, Read INT, DateAdded DATE)")
