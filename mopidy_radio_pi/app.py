
from __future__ import unicode_literals
from tornado.escape import json_encode

#import ptvsd
#ptvsd.enable_attach(None)

import logging
import os

import tornado.locale
import tornado.web
import tornado.websocket
import json
import urlparse
import csv
import codecs
import sqlite3 as lite
import sys

_DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
_LOCALE_DIR = os.path.join(_DATA_DIR, 'locale')
_STATIC_DIR = os.path.join(_DATA_DIR, 'static')
_TEMPLATE_DIR = os.path.join(_DATA_DIR, 'template')

_SPECIALSCRIPTS_DIR = os.path.join(_STATIC_DIR, 'SpecialScripts')
db_path = os.path.join(_DATA_DIR, "radiopi.db")

logger = logging.getLogger(__name__)


from csvhelpers import GetUsers    
from csvhelpers import GetPermissions   
from csvhelpers import WriteRow  

# TODO: refactor, currently using 2 dicts to get users and their permissions from same csv
users = {}
users = GetUsers('users.csv')
permissions = {}
permissions = GetPermissions('users.csv')

# Array for webSockets
wss = []

wsClients = dict()

class BaseHandler(tornado.web.RequestHandler):
    DOMAIN = 'radiopi'
    def initialize(self, core, config):
        from . import Extension
        self._template_kwargs = {
            'title': 'radioPi',
            'error': '',
            'permissionLevel': '',  
            'wsClients': wsClients  ,
            'rpiConfig': config,
            'tracklists' :  dict()     
        }
        self.core = core

    def get_current_user(self):     
        if self.get_cookie("logincookie_user"):
            self._template_kwargs['permissionLevel'] = permissions[self.get_cookie("logincookie_user")] 
        return self.get_cookie("logincookie_user")       

class IndexHandler(BaseHandler):
    def get(self, path):      
        if not self.current_user:
           #self.redirect("login")
           return self.render('index.html', **self._template_kwargs)
        else:        
           if not users[self.current_user] == self.get_cookie("logincookie_password"):
               self.redirect("login")
           else:                                     
               return self.render('index.html', **self._template_kwargs)
         
class LoginHandler(BaseHandler):      
    def get(self, path):
        self.current_user
        return self.render('login.html', **self._template_kwargs)

    def post(self, path):                 
        if self.get_argument('name') not in users:
              self._template_kwargs['error'] = 'Username does not exist'   
              self.render('login.html', **self._template_kwargs)
        elif (users[self.get_argument('name')] == self.get_argument('password')):
              # Now check the user has been approved (permission level > 0)
              if (int(permissions[self.get_argument('name')]) > 0):
                  self.set_cookie("logincookie_user", self.get_argument('name'), expires_days=None)
                  self.set_cookie("logincookie_password", self.get_argument('password'), expires_days=None)  
                  # Call wsSend and send message to admins notifying of login
                  wsSendToAdmin('UserLogin: ' + self.get_argument('name'))             
                  self.redirect("index.html")
              else:
                  self._template_kwargs['error'] = 'Account has not yet been approved'   
                  self.render('login.html', **self._template_kwargs)
        else:
           self._template_kwargs['error'] = 'Invalid password'   
           self.render('login.html', **self._template_kwargs)

class RegisterHandler(BaseHandler):      
    def get(self, path):
        self.current_user
        return self.render('register.html', **self._template_kwargs)

    def post(self, path):                 
        if (self.get_argument('name', '') and self.get_argument('password', '')):                               
            if(self.get_argument('password') == self.get_argument('confirmPassword')):  
                #register user
                WriteRow('users.csv', [self.get_argument('name'),self.get_argument('password'), '0'])
                #self.render('login.html', **self._template_kwargs)
            else:
                self._template_kwargs['error'] = 'Passwords do not match'   
                self.render('register.html', **self._template_kwargs)     
        else:
            self._template_kwargs['error'] = 'Please enter a username and password'   
            self.render('register.html', **self._template_kwargs)

class TracklistsHandler(BaseHandler):
    def get(self, path):
        if not self.current_user:
           self.redirect("login")
        else:        
           if not users[self.current_user] == self.get_cookie("logincookie_password"):
               self.redirect("login")
           else:              
               if (int(permissions[self.current_user]) > 1):
                    self._template_kwargs['tracklists']['tracklistname'] = 'tracklist1' 
                    return self.render('tracklists.html', **self._template_kwargs)
               else:
                    self.redirect("404")

class AddTrackHandler(BaseHandler):
    def post(self, path):
        if not self.current_user:
           self.redirect("500")
        else:        
           if not users[self.current_user] == self.get_cookie("logincookie_password"):
               self.redirect("500")
           else:   
               con = lite.connect(db_path)
               with con:
                   trackName = self.request.arguments['trackName']
                   requestorName = self.request.arguments['requestorName']
                   requestorDedicate = self.request.arguments['requestorDedicate']
                   requestorComment = self.request.arguments['requestorComment']
                                   
                   cur = con.cursor()

                   cur.execute("SELECT Id FROM UserProfile WHERE UserName=?", (self.current_user,))        
                   con.commit()
                   row = cur.fetchone()
                   print row[0]

                   cur = con.cursor()

                   sql = "insert into TracklistTracks (TracklistId, PlaylistUri, UserProfileId, TrackTitle, TrackArtist, TrackAlbum, TrackUri, ChosenBy, DedicatedTo, Comments, DateAdded, Username, BeenPlayed, OnHold) values (1, '', ?, ?, ?, ?, ?, ?, ?, ?, date('now'), ?, 0, 0)"
                   parameters = [row[0], str(trackName), unicode(self.request.arguments['artistName']), unicode(self.request.arguments['albumName']), unicode(self.request.arguments['trackUri']), unicode(requestorName), unicode(requestorDedicate), unicode(requestorComment), unicode(self.current_user)]
                   cur.execute(sql, parameters)
             
                         
class GetTrackHandler(BaseHandler):
    def get(self, path):
        con = lite.connect(db_path)
        with con:
            cur = con.cursor()   
            cur.execute("SELECT TrackUri, ChosenBy, DedicatedTo, Comments FROM TracklistTracks WHERE DateAdded = date('now') AND TrackUri=?", self.request.arguments['trackUri'])        
            con.commit()
            row = cur.fetchone()
            print row[0], row[1], row[2], row[3]
            obj = { 
             'TrackUri': row[0],
             'ChosenBy': row[1],
             'DedicatedTo': row[2],
             'Comments': row[3]  
            }
        self.write(json_encode(obj))

class LikeTrackHandler(BaseHandler):
    def post(self, path):
        con = lite.connect(db_path)
        with con:
            cur = con.cursor()   
            cur.execute("SELECT Id FROM UserProfile WHERE UserName=?", (self.current_user,))        
            con.commit()
            row = cur.fetchone()
            print row[0]
            profileId = row[0]

            #self.write(repr(self.request))

            cur = con.cursor()   
            cur.execute("Select count(*) from TrackLikes WHERE DateLiked=date('now') AND Username=? AND HostAddress=? AND TrackUri=?",(unicode(self.current_user), unicode(self.request.remote_ip), unicode(self.request.arguments['trackUri'])))        					          
            
            con.commit()
            row = cur.fetchone()
            print row[0]
            if row[0] < 1:                
                sql = "insert into TrackLikes (TrackUri, TrackTitle, TrackArtist, TrackAlbum, TracklistId, UserProfileId, Username, HostAddress, DateLiked) values (?, ?, ?, ?, 1, ?, ?, ?, date('now'))"
                parameters = [unicode(self.request.arguments['trackUri']), unicode(self.request.arguments['trackName']) , unicode(self.request.arguments['artistName']), unicode(self.request.arguments['albumName']), profileId, unicode(self.current_user), unicode(self.request.remote_ip)]
                cur.execute(sql, parameters)
                obj = { 
                 'sucess': 'Track sucessfully liked', 
                }
                wsSendAll({'notificationType': 'trackLiked', 'trackUri' : self.request.arguments['trackUri']}) 
            else:
                obj = { 
                 'error': 'Track already liked once by you today', 
                }
        self.write(json_encode(obj))
       
        
class AdminHandler(BaseHandler):      
    def get(self, path):      
        if not self.current_user:
           self.redirect("login")
        else:        
           if not users[self.current_user] == self.get_cookie("logincookie_password"):
               self.redirect("login")
           else:              
               if (int(permissions[self.current_user]) > 1):
                    return self.render('admin.html', **self._template_kwargs)
               else:
                    self.redirect("404")

class CookieHandler(BaseHandler):  
    def get(self, path):        
        self.clear_cookie("logincookie_password") 
        self.clear_cookie("logincookie_user")         


class LogoutHandler(BaseHandler):  
    def get(self, path):        
        self.clear_cookie("logincookie_password") 
        self.clear_cookie("logincookie_user")  
        self.redirect("index.html")
                   


class PiWebSocket(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        self.id = self.get_argument("clientId")
        wsClients[self.get_argument("clientId")] = {'clientId': self.id}
        if self not in wss:
            wss.append(self)
        wsSendToAdmin('OpenWebSocket: ' + self.id)
        wsSendToAdmin(wsClients) #Send the dict as a WebSocket message so admin can see who is connected

    def on_message(self, message):      
        # Need some checks for the type of message - track liked, track voted for etc               
        self.messageDeser = json.dumps(urlparse.parse_qs(message))
        #wsClients[self.id] = {'clientId': self.id, 'message':self.messageDeser}           
        #self.write_message(wsClients[self.id])
 
    def on_close(self):
        if self in wss:
            wss.remove(self)
        if self.id in wsClients:
            del wsClients[self.id]
            wsSendToAdmin('ClosedWebSocket: ' + self.id)
                
def wsSend(message, ws):   
    if not ws.ws_connection.stream.socket:
        print "Web socket does not exist anymore!!!"
        wss.remove(ws)
    else:
        ws.write_message(message)

def wsSendAll(message):
    for ws in wss:
        if not ws.ws_connection.stream.socket:
            print "Web socket does not exist anymore!!!"
            wss.remove(ws)
        else:
            ws.write_message(message)

def wsSendToAdmin(message):
    for ws in wss:
        if (int(permissions[ws.id]) > 1):
            wsSend(message, ws) 


class AddTrackScriptHandler(BaseHandler):
    def get(self, path):  
        if not self.current_user:
           self.write("")  
        else:                            
           return self.render('data/static/Scripts/addTrack.js', **self._template_kwargs)     
   


def radio_pi_factory(config, core):
    return [
        (r'/(index.html)?', IndexHandler, {'core': core, 'config': config}),             
        (r'/(login)?', LoginHandler, {'core': core, 'config': config}),
        (r'/(admin)?', AdminHandler, {'core': core, 'config': config}),
        (r'/(register)?', RegisterHandler, {'core': core, 'config': config}),
        (r'/(logout)?', LogoutHandler, {'core': core, 'config': config}),
        (r'/(piWs)?', PiWebSocket),          
        (r'/(Scripts/addTrack.js)?', AddTrackScriptHandler, {'core': core, 'config': config}), 
        (r'/(tracklists)?', TracklistsHandler, {'core': core, 'config': config}),
        (r'/(addTrack)?', AddTrackHandler, {'core': core, 'config': config}),      
        (r'/(getTrack)?', GetTrackHandler, {'core': core, 'config': config}),     
        (r'/(likeTrack)?', LikeTrackHandler, {'core': core, 'config': config}),
        (r'/(.*)', tornado.web.StaticFileHandler, {'path': _STATIC_DIR}),
       
        
    ]


