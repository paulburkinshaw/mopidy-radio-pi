import SocketServer
import MyHandler
import sqlite3 as lite

con = lite.connect('db/radiopi.db')
			
con.text_factory = str

with con:
					
		cur = con.cursor()    

		cur.execute("DELETE FROM Tracklist")        
		con.commit()
    			

PORT = 8000

Handler = MyHandler.TrackListHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "servering at port", PORT
httpd.serve_forever()
