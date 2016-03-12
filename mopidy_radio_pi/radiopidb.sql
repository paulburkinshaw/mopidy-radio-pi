BEGIN TRANSACTION;
CREATE TABLE UserProfile(Id INTEGER PRIMARY KEY, UserName TEXT, Password TEXT, FirstName TEXT, Surname TEXT, Email TEXT, NickName TEXT, Bio TEXT, ProfilePicture TEXT, Vibes INT, LevelId INT, TracksRequested INT, TracksSkipped INT, TracksSucessfullySkipped INT, TracksLiked INT, Enabled INT, PermissionLevel INT);
INSERT INTO `UserProfile` (Id,UserName,Password,FirstName,Surname,Email,NickName,Bio,ProfilePicture,Vibes,LevelId,TracksRequested,TracksSkipped,TracksSucessfullySkipped,TracksLiked,Enabled,PermissionLevel) VALUES (1,'pburkinshaw','pipi','Paul','Burkinshaw','paulburkinshaw@sigplc.com','pb1','Something here','pbpic.jpg',1,1,0,0,0,0,1,2),
 (2,'jdawes','itspitime','Jules','Dawes','jdawes@sigplc.com','jdawes','Something here','jd1.jpg',1,1,0,0,0,0,1,1),
 (3,'ccoates','havok123',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (4,'jcalvo','musical1',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (5,'phardy','chorus123',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (6,'lwhite','track123',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (7,'marzena','uptown',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (8,'lreader','listen123',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (9,'apoole','xxx',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (10,'abs','phonic',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (11,'mridge','keverett',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (12,'nroberts','bridge123',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (13,'pb2','song123',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (14,'rcassey','m16007',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (15,'staylor','itteam123',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (16,'aleekya','air123',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (17,'tanuja','music1',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1),
 (18,'clive','test123',NULL,NULL,NULL,NULL,NULL,NULL,1,1,0,0,0,0,1,1);
CREATE TABLE UserNotifications(Id INTEGER PRIMARY KEY, UserProfileId INT, UserName TEXT, NotificationText TEXT, Read INT, DateAdded DATE);
CREATE TABLE TracklistTracks(Id INTEGER PRIMARY KEY, TracklistId INT, PlaylistUri TEXT, UserProfileId INT INT, TrackTitle TEXT, TrackArtist TEXT, TrackAlbum TEXT, TrackUri TEXT, ChosenBy TEXT, DedicatedTo TEXT, Comments TEXT, DateAdded DATE, Username TEXT, BeenPlayed INT, OnHold INT);
CREATE TABLE Tracklist(Id INTEGER PRIMARY KEY, ThemeId INT, PlaylistUri TEXT, TrackListTitle TEXT, TrackListDescription TEXT, TrackListImage TEXT, TracklistUser TEXT, TrackListDate DATE, IsCurrent INT);
INSERT INTO `Tracklist` (Id,ThemeId,PlaylistUri,TrackListTitle,TrackListDescription,TrackListImage,TracklistUser,TrackListDate,IsCurrent) VALUES (1,1,'','Default Tracklist','Default Tracklist Description','DefaultTracklistImg.jpg','admin','2015-10-11',1);
CREATE TABLE TrackSkips(Id INTEGER PRIMARY KEY, TrackId INT, TrackUri TEXT, TracklistId INT, UserProfileId INT, Username TEXT, Comments TEXT, DateSkipped DATE, HostAddress TEXT);
CREATE TABLE TrackLikes(Id INTEGER PRIMARY KEY, TrackId INT, TrackUri TEXT, TracklistId INT, UserProfileId INT, Username TEXT, Comments TEXT, DateLiked DATE, HostAddress TEXT);
CREATE TABLE TrackComments(Id INTEGER PRIMARY KEY, TrackId INT, TrackUri TEXT, UserProfileId INT, Username TEXT, Comments TEXT, DateAdded DATE);
CREATE TABLE ThemeBanners(Id INTEGER PRIMARY KEY, ThemeId INT, BannerImageFileName TEXT, BannerImagePath TEXT, DateAdded DATE);
CREATE TABLE Theme(Id INTEGER PRIMARY KEY, ThemeTitle TEXT, ThemeDescription TEXT, ThemeImage TEXT);
INSERT INTO `Theme` (Id,ThemeTitle,ThemeDescription,ThemeImage) VALUES (1,'Default Theme','Default Theme Description','defaultThemeImg1.jpg');
CREATE TABLE RequestedTracks(Id INTEGER PRIMARY KEY, TracklistId INT, TrackId INT, UserProfileId INT, Username TEXT, PlaylistUri TEXT, TrackTitle TEXT, TrackArtist TEXT, TrackUri TEXT, ChosenBy TEXT, DedicatedTo TEXT, Comments TEXT, DateAdded DATE, BeenPlayed INT, OnHold INT);
CREATE TABLE Level(Id INTEGER PRIMARY KEY, LevelName TEXT, LevelDescription TEXT, LevelIcon TEXT, VibesRequired INT, TracksAllowed INT, VotePower INT, SkipPower INT);
INSERT INTO `Level` (Id,LevelName,LevelDescription,LevelIcon,VibesRequired,TracksAllowed,VotePower,SkipPower) VALUES (1,'Level 1','First Level','level1.jpg',1,3,1,1);
CREATE TABLE FavouriteTracks(Id INTEGER PRIMARY KEY, UserProfileId INT, Username TEXT, TrackUri TEXT, TrackTitle TEXT, TrackArtist TEXT, DateAdded DATE);
CREATE TABLE CurrentTrack(Id INTEGER PRIMARY KEY, TrackId INT, TracklistId INT, TrackUri TEXT);
COMMIT;
