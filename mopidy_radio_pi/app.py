from __future__ import unicode_literals

import logging
import os

import tornado.locale
import tornado.web
import tornado.websocket
import json
import urlparse

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
        if self.get_argument('password') == self.password:
            self.set_cookie("userAuthenticated",  'true')     
            #self.set_secure_cookie("loginCookie", self.get_argument("name"))
            self.redirect("index.html")
        else:
            self._template_kwargs['error'] = 'Invalid username or password'
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


class NotificationsWebSocket(tornado.websocket.WebSocketHandler):
    def open(self, *args):
        self.id = self.get_argument("clientId")
        #self.type = self.get_argument("type")        
        #self.set_nodelay(True)
        #clients[self.id] = {'clientId': self.id, 'type': self.type}
        clients[self.id] = {'clientId': self.id}

    def on_message(self, message):        
        #self.write_message("Client %s received a message : %s" % (self.id, message))
        self.messageDeser = json.dumps(urlparse.parse_qs(message))
        #clients[self.id] = message
        self.write_message(self.messageDeser)
 
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


