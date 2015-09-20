
from __future__ import unicode_literals

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

_DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
_LOCALE_DIR = os.path.join(_DATA_DIR, 'locale')
_STATIC_DIR = os.path.join(_DATA_DIR, 'static')
_TEMPLATE_DIR = os.path.join(_DATA_DIR, 'template')

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
            'rpiConfig': config       
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
        if (int(permissions[ws.id]) > 0):
            wsSend(message, ws) 


   

def radio_pi_factory(config, core):
    return [
        (r'/(index.html)?', IndexHandler, {'core': core, 'config': config}),             
        (r'/(login)?', LoginHandler, {'core': core, 'config': config}),
        (r'/(admin)?', AdminHandler, {'core': core, 'config': config}),
        (r'/(register)?', RegisterHandler, {'core': core, 'config': config}),
        (r'/(clearcookie)?', CookieHandler, {'core': core, 'config': config}),
        (r'/(piWs)?', PiWebSocket),
        (r'/(.*)', tornado.web.StaticFileHandler, {'path': _STATIC_DIR}),
        
    ]


