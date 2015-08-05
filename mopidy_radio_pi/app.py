
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
        from csvhelpers import GetDict       
        users = {}
        users = GetDict('users.csv')
        if not self.get_cookie("userAuthenticated"):
           self.redirect("login")
        else:
           if not self.get_cookie("logincookie_user"):
              self.redirect("login")
           else:
              if not users[self.get_cookie("logincookie_user")] == self.get_cookie("logincookie_password"):
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
       
         
    def get_current_user(self):
        return self.get_cookie("userAuthenticated")
        #return self.get_secure_cookie("loginCookie")

    def get(self, path):
        return self.render('login.html', **self._template_kwargs)

    def post(self, path):            
        from csvhelpers import GetDict       
        users = {}
        users = GetDict('users.csv')

        if self.get_argument('name') not in users:
              self._template_kwargs['error'] = 'Username does not exist'   
              self.render('login.html', **self._template_kwargs)
        elif users[self.get_argument('name')] == self.get_argument('password'):
              self.set_cookie("logincookie_user", self.get_argument('name'))
              self.set_cookie("logincookie_password", self.get_argument('password'))
              self.set_cookie("userAuthenticated", 'true')
              self.redirect("index.html")
        else:
           self._template_kwargs['error'] = 'Invalid password'   
           self.render('login.html', **self._template_kwargs)


class CookieHandler(tornado.web.RequestHandler):
     
    def initialize(self, core, config):
        from . import Extension
        self._template_kwargs = {
            'title': 'cookiehandler'            
        }
        self.core = core

    def get(self, path):
        self.clear_cookie("userAuthenticated") 
        self.clear_cookie("logincookie_password") 
        self.clear_cookie("logincookie_user") 


class NotificationsWebSocket(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        self.id = self.get_argument("clientId")
        #self.type = self.get_argument("type")        
        #self.set_nodelay(True)
        #clients[self.id] = {'clientId': self.id, 'type': self.type}
        clients[self.id] = {'clientId': self.id}

    def on_message(self, message):                     
        self.messageDeser = json.dumps(urlparse.parse_qs(message))
        clients[self.id] = {'clientId': self.id, 'message':self.messageDeser}           
        self.write_message(clients[self.id])
 
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


