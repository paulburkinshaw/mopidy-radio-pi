from __future__ import unicode_literals

import logging
import os

import tornado.locale
import tornado.web
import tornado.websocket
import json
import urlparse
import csv
import codecs

_DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
_LOCALE_DIR = os.path.join(_DATA_DIR, 'locale')
_STATIC_DIR = os.path.join(_DATA_DIR, 'static')
_TEMPLATE_DIR = os.path.join(_DATA_DIR, 'template')

logger = logging.getLogger(__name__)


clients = dict()

class IndexHandler(tornado.web.RequestHandler):

    DOMAIN = 'radiopi'

    def initialize(self, core, config):
        from . import Extension
        self._template_kwargs = {
            'title': 'radioPi'
        }
        self.core = core

    def get_current_user(self):
        return self.get_cookie("userAuthenticated")
        #return self.get_secure_cookie("loginCookie")

    def get(self, path):
        if not self.get_cookie("userAuthenticated"):
           self.redirect("login")
        else:
           return self.render('index.html', **self._template_kwargs)

class LoginHandler(tornado.web.RequestHandler):
     
    def initialize(self, core, config):
        from . import Extension
        self._template_kwargs = {
            'title': 'login',
            'error': ''
        }
        self.core = core
        self.username = 'paulyb263'
        self.password = 'l5on12'
    
    def get_current_user(self):
        return self.get_cookie("userAuthenticated")
        #return self.get_secure_cookie("loginCookie")

    def get(self, path):
        return self.render('login.html', **self._template_kwargs)

    def post(self, path):
        
        #usersFile = open("users.txt","r")
        #for line in usersFile:
        #    aLine = line.readline()
        #    key, value = aLine.split(',')
        #    res[key] = value
        #    self._template_kwargs['error'] = aLine
        #    if key == self.get_argument('name'):
        #        if res[key] == self.get_argument('password'):
        #            self.set_cookie("userAuthenticated",  'true') 
        #        else:
        #            break
        #            usersFile.close()
                    #self._template_kwargs['error'] = 'Invalid username or password'
                    #self.render('login.html', **self._template_kwargs)                
        #usersFile.close()    
        
        from csvhelpers import GetDict
        
        users = {}
        users = GetDict('users.csv')

        # load users from csv file into dict
        #users = {}
        #path = os.path.dirname(os.path.realpath(__file__))
        #with open(path + '/users.csv', 'rb') as f:
        #    reader = csv.reader(f, delimiter=str(u','))
        #    for row in reader:
        #        if len(row):
        #           if row[0].startswith(codecs.BOM_UTF8):
        #              row[0] = row[0][3:]
        #              users[row[0]] = row[1]
        #           else:
        #              users[row[0]] = row[1]

        if users[self.get_argument('name')] == self.get_argument('password'):
              self.set_cookie("logincookie_user", self.get_argument('name'))
              self.set_cookie("logincookie_password", self.get_argument('password'))
              self.set_cookie("userAuthenticated", 'true')
              self.redirect("index.html")
        else:
           self._template_kwargs['error'] = 'Invalid username or password'   
           self.render('login.html', **self._template_kwargs)

        #self._template_kwargs['error'] = users   
    

        #usersFile.close() 

            
        #self._template_kwargs['error'] = 'Username not found'
       # self.render('login.html', **self._template_kwargs)

        #if self.get_argument('password') == self.password:
            #self.set_cookie("userAuthenticated",  'true')     
            #self.set_secure_cookie("loginCookie", self.get_argument("name"))
            #self.redirect("index.html")
        #else:
            #self._template_kwargs['error'] = 'Invalid username or password'
            #self.render('login.html', **self._template_kwargs)

class CookieHandler(tornado.web.RequestHandler):
     
    def initialize(self, core, config):
        from . import Extension
        self._template_kwargs = {
            'title': 'cookiehandler'            
        }
        self.core = core

    def get(self, path):
        self.clear_cookie("userAuthenticated") 
        self.clear_cookie("logincookie") 
        self.clear_cookie("mycookie") 


class NotificationsWebSocket(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        self.id = self.get_argument("clientId")
        #self.type = self.get_argument("type")        
        #self.set_nodelay(True)
        #clients[self.id] = {'clientId': self.id, 'type': self.type}
        clients[self.id] = {'clientId': self.id}

    def on_message(self, message):        
        #self.write_message("Client %s received a message : %s" % (self.id, message))
        
        #clients[self.id] = message
        #with open('users.txt') as userText:
             #lines = userText.read()  
       
        #file = open('users.txt')
        #for line in file:
            #fields = line.strip().split()
            #gah = fields[0]
        #print fields[0], fields[1], fields[2], fields[3]
        #usersFile = open ("users.txt", "r")
        
        #data=usersFile.readlines()

        #fileName = 'users.txt'
        #inFile = open(fileName, 'r')
        #colors = json.load(inFile)
        #inFile.close()

       

        self.messageDeser = json.dumps(urlparse.parse_qs(message))
              
        self.write_message( self.messageDeser)
 
    def on_close(self):
        if self.id in clients:
            del clients[self.id]

   

def radio_pi_factory(config, core):
    return [
        (r'/(index.html)?', IndexHandler, {'core': core, 'config': config}),
        (r'/(login)?', LoginHandler, {'core': core, 'config': config}),
        (r'/(clearcookie)?', CookieHandler, {'core': core, 'config': config}),
        (r'/(notifications)?', NotificationsWebSocket),
        (r'/(.*)', tornado.web.StaticFileHandler, {'path': _STATIC_DIR}),
        
    ]


