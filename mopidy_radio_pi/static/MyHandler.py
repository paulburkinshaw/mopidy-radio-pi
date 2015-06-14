import SimpleHTTPServer
import sqlite3 as lite
import sys
import urlparse
import datetime
import json
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer


class TrackListHandler(BaseHTTPRequestHandler):

	def do_OPTIONS(self):     	
		self.send_response(200) 
		self.send_header('application/json; charset=utf8');		
		self.send_header('Access-Control-Allow-Origin', '*')                
		self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
		self.send_header("Access-Control-Allow-Headers", "X-Requested-With")  
		self.send_header("Access-Control-Allow-Headers", "Authorization")
		
	def do_GET(self):   
		
		parsedParameters = urlparse.urlparse(self.path)
		queryParsed = urlparse.parse_qs(parsedParameters.query)
		
		if( 'type' in queryParsed ):
			typeString = queryParsed['type']
			if('addTrack' in typeString):
				trackUriString = queryParsed['trackUri']
				userString = queryParsed['user']
				dedicateString = queryParsed['dedicate']
				commentsString = queryParsed['comments']
				self.addTrack(trackUriString, userString, dedicateString, commentsString)
			elif('getTrack' in typeString):
				trackUriString = queryParsed['trackUri']
				self.getTrack(trackUriString)
			elif('getTrackRating' in typeString):
				trackUriString = queryParsed['trackUri']
				self.getTrackRating(trackUriString)				
			elif('likeTrack' in typeString):
				trackUriString = queryParsed['trackUri']
				trackNameString = queryParsed['trackname']
				trackArtistString = queryParsed['artist']
				trackAlbumString = queryParsed['album']
				self.likeTrack(trackUriString, trackNameString, trackArtistString, trackAlbumString)
			elif('voteToSkipTrack' in typeString):
				trackUriString = queryParsed['trackUri']
				trackNameString = queryParsed['trackname']
				trackArtistString = queryParsed['artist']
				trackAlbumString = queryParsed['album']
				self.voteToSkipTrack(trackUriString, trackNameString, trackArtistString, trackAlbumString)	
			elif('getTrackVotes' in typeString):
				trackUriString = queryParsed['trackUri']
				self.getTrackVotes(trackUriString)
			elif('getTrackVotesAndRating' in typeString):
				trackUriString = queryParsed['trackUri']
				self.getTrackVotesAndRating(trackUriString)
			elif('getTrendingTracks' in typeString):
				self.getTrendingTracks()
			elif('shutdownPi' in typeString):
				self.shutdownPi()
			elif('rebootPi' in typeString):
				self.rebootPi()
				
		else:
			BaseHTTPRequestHandler.SimpleHTTPRequestHandler.do_GET(self);
	
	def getTrack(self, trackUri):
	
		self.send_response(200)
		self.send_header("Access-Control-Allow-Headers", "Authorization")
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Content-type', 'application/json; charset=utf8')                                    
		self.end_headers() 
		
		if trackUri[0]:

			con = lite.connect('db/radiopi.db')
			
			con.text_factory = str

			with con:
					
					cur = con.cursor()    

					cur.execute("SELECT TrackUri, ChosenBy, DedicatedTo, Comments FROM Tracklist WHERE TrackUri=:TrackUri", {"TrackUri": trackUri[0]})        
					con.commit()
    
					row = cur.fetchone()
					
					#returnedTrackUri, returnedChosenBy, returnedComments = cur.fetchone()
					print row[0], row[1], row[2], row[3]
							
			self.wfile.write('{0}({1})'.format('jsonpGetTrackCallback', {'userString':row[1], 'dedicatedToString':row[2], 'commentString':row[3]}))					
			self.wfile.close()
	
	def addTrack(self, trackUri, user, dedicate, comments):
		
		self.send_response(200)
		self.send_header("Access-Control-Allow-Headers", "Authorization")
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Content-type', 'application/json; charset=utf8')                                    
		self.end_headers()  
		
		if trackUri[0]:
			
			con = lite.connect('db/radiopi.db')

			with con:
				
					cur = con.cursor()   
							
					cur.execute("insert into Tracklist (TrackUri, ChosenBy, DedicatedTo, Comments, DateAdded) values (?, ?, ?, ?, date('now'))",(trackUri[0], user[0], dedicate[0], comments[0]))
									
			self.wfile.write('{0}({1})'.format('jsonpAddTrackCallback', {'trackUriString':trackUri[0], 'userString':user[0], 'dedicatedToString':dedicate[0],'commentString':comments[0]}))					
			self.wfile.close()
			
	def likeTrack(self, trackUri, trackname, artist, album):
		
		self.send_response(200)
		self.send_header("Access-Control-Allow-Headers", "Authorization")
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Content-type', 'application/json; charset=utf8')                                    
		self.end_headers()  
		
		if trackUri[0]:
			
			con = lite.connect('db/radiopi.db')

			with con:
					cur = con.cursor()   
					
					cur.execute("Select count(*) from UpVote where HostAddress=:HostAddress AND TrackUri=:TrackUri AND DateVoted=date('now')", {"HostAddress": self.client_address[0], "TrackUri": trackUri[0]})        
					con.commit()
    
					row = cur.fetchone()
					print row[0]
					
					if row[0] < 1:						
						cur.execute("insert into UpVote (TrackUri, DateVoted, HostAddress, TrackName, Artist, Album) values (?, date('now'), ?, ?, ?, ?)",(trackUri[0],self.client_address[0],trackname[0], artist[0], album[0],))
						self.wfile.write('{0}({1})'.format('jsonpLikeTrackCallback', {'trackUriString':trackUri[0], 'likeAdded':'true'}))					
						self.wfile.close()
					else:
						self.wfile.write('{0}({1})'.format('jsonpLikeTrackCallback', {'trackUriString':trackUri[0], 'likeAdded':'false', 'failedLikeReason':'You may only like a track once'}))					
						self.wfile.close()
					
					#cur = con.cursor()   
							
					#cur.execute("insert into UpVote (TrackUri, DateVoted) values (?, date('now'))",(trackUri[0],))
									
			#self.wfile.write('{0}({1})'.format('jsonpLikeTrackCallback', {'trackUriString':trackUri[0]}))					
			#self.wfile.close()
			
	def voteToSkipTrack(self, trackUri, trackname, artist, album):
		
		self.send_response(200)
		self.send_header("Access-Control-Allow-Headers", "Authorization")
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Content-type', 'application/json; charset=utf8')                                    
		self.end_headers()  
		
		if trackUri[0]:
			
			con = lite.connect('db/radiopi.db')

			with con:
					today = datetime.datetime.now()
					todayStr =  "%s-%s-%s" % (today.year, today.month, today.day)
					
					cur = con.cursor()   
					
					cur.execute("Select count(*) from votetoskip where HostAddress=:HostAddress AND TrackUri=:TrackUri AND DateVoted=date('now')", {"HostAddress": self.client_address[0], "TrackUri": trackUri[0]})        
					con.commit()
    
					row = cur.fetchone()
					print row[0]
					
					if row[0] < 1:						
						cur.execute("insert into VoteToSkip (TrackUri, DateVoted, HostAddress, TrackName, Artist, Album) values (?, date('now'), ?, ?, ?, ?)",(trackUri[0],self.client_address[0],trackname[0], artist[0], album[0],))
						self.wfile.write('{0}({1})'.format('jsonpVoteToSkipTrackCallback', {'trackUriString':trackUri[0], 'voteAdded':'true'}))					
						self.wfile.close()
					else:
						self.wfile.write('{0}({1})'.format('jsonpVoteToSkipTrackCallback', {'trackUriString':trackUri[0], 'voteAdded':'false', 'failedVoteReason':'Sorry you have exceeded your daily skipping quota for this track, but dont worry if the song is that bad Im sure someone else will click the button '}))					
						self.wfile.close()
			
			
	def getTrackVotes(self, trackUri):
		
		self.send_response(200)
		self.send_header("Access-Control-Allow-Headers", "Authorization")
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Content-type', 'application/json; charset=utf8')                                    
		self.end_headers()  
		
		if trackUri[0]:
			
			con = lite.connect('db/radiopi.db')

			with con:
				
					cur = con.cursor()   
							
					cur.execute("SELECT COUNT(*) FROM VoteToSkip WHERE TrackUri=:TrackUri", {"TrackUri": trackUri[0],})
					con.commit()
    
					row = cur.fetchone()
									
					print row[0]
					
			self.wfile.write('{0}({1})'.format('jsonpGetTrackVotesCallback', {'trackVotes':row[0]}))					
			self.wfile.close()
			
	def getTrackRating(self, trackUri):	
		self.send_response(200)
		self.send_header("Access-Control-Allow-Headers", "Authorization")
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Content-type', 'application/json; charset=utf8')                                    
		self.end_headers() 
		
		if trackUri[0]:

			con = lite.connect('db/radiopi.db')	
			con.text_factory = str

			with con:
					
					cur = con.cursor()    

					cur.execute("SELECT COUNT(*) FROM UpVote WHERE TrackUri=:TrackUri", {"TrackUri": trackUri[0],})        
					con.commit()
    
					row = cur.fetchone()
									
					print row[0]
							
			self.wfile.write('{0}({1})'.format('jsonpGetTrackRatingCallback', {'trackRating':row[0]}))					
			self.wfile.close()
			
	def getTrackVotesAndRating(self, trackUri):	
		self.send_response(200)
		self.send_header("Access-Control-Allow-Headers", "Authorization")
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Content-type', 'application/json; charset=utf8')                                    
		self.end_headers() 
		
		if trackUri[0]:

			con = lite.connect('db/radiopi.db')	
			con.text_factory = str

			with con:
					
					cur = con.cursor()    

					cur.execute("SELECT COUNT(*) FROM UpVote WHERE TrackUri=:TrackUri", {"TrackUri": trackUri[0],})        
					con.commit()
    
					upVoteRow = cur.fetchone()
					
					print upVoteRow[0]
					
					cur.execute("SELECT COUNT(*) FROM VoteToSkip WHERE TrackUri=:TrackUri", {"TrackUri": trackUri[0],})
					con.commit()
    
					skipRow = cur.fetchone()
									
					print skipRow[0]
					
					totalVotes = skipRow[0] - upVoteRow[0]
							
			self.wfile.write('{0}({1})'.format('jsonpGetTrackVotesAndRatingCallback', {'totalTrackVotes':totalVotes, "skipVotes":skipRow[0], "rating":upVoteRow[0], "trackUri":trackUri[0] }))					
			self.wfile.close()
		
	def getTrendingTracks(self):
		self.send_response(200)
		self.send_header("Access-Control-Allow-Headers", "Authorization")
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Content-type', 'application/json; charset=utf8')                                    
		self.end_headers() 
		
		con = lite.connect('db/radiopi.db')	
		con.text_factory = str

		with con:
				
				cur = con.cursor()    

				cur.execute("select trackuri, TrackName, Artist, Album, count(*) as totalvotes from upvote group by trackuri order by totalvotes desc;")        
				con.commit()

				rows = cur.fetchall()
				#rows = [ dict(rec) for rec in recs ]
						
		self.wfile.write('{0}({1})'.format('jsonpGetTrendingTracksCallback', {'trendingTracks':json.dumps(rows)}))					
		self.wfile.close()
	
	def rebootPi(self):
		
		self.send_response(200)
		self.send_header("Access-Control-Allow-Headers", "Authorization")
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Content-type', 'application/json; charset=utf8')                                    
		self.end_headers()  
		
		command = "/usr/bin/sudo /sbin/shutdown -r now"
		import subprocess
		process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
		output = process.communicate()[0]
		print output
	
	def shutdownPi(self):
		
		self.send_response(200)
		self.send_header("Access-Control-Allow-Headers", "Authorization")
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Content-type', 'application/json; charset=utf8')                                    
		self.end_headers()  
		
		command = "/usr/bin/sudo /sbin/shutdown -h now"
		import subprocess
		process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
		output = process.communicate()[0]
		print output