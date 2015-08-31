﻿
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

from csvhelpers import GetUsers    
from csvhelpers import GetPermissions   
from csvhelpers import WriteRow  

# TODO: refactor, currently using 2 dicts to get users and their permissions from same csv
users = {}
users = GetUsers('users.csv')
permissions = {}
permissions = GetPermissions('users.csv')

class BaseHandler(tornado.web.RequestHandler):
    DOMAIN = 'radiopi'
    def initialize(self, core, config):
        from . import Extension
        self._template_kwargs = {
            'title': 'radioPi',
            'error': '',
            'permissionLevel': ''
        }
        self.core = core

    def get_current_user(self):     
        if self.get_cookie("logincookie_user"):
            self._template_kwargs['permissionLevel'] = permissions[self.get_cookie("logincookie_user")] 
        return self.get_cookie("logincookie_user")       

class IndexHandler(BaseHandler):
    def get(self, path):      
        if not self.current_user:
           self.redirect("login")
        else:        
           if not users[self.current_user] == self.get_cookie("logincookie_password"):
               self.redirect("login")
           else:              
               #self._template_kwargs['permissionLevel'] = permissions[self.current_user]
               return self.render('index.html', **self._template_kwargs)


class LoginHandler(BaseHandler):      
    def get(self, path):
        self.current_user
        return self.render('login.html', **self._template_kwargs)

    def post(self, path):                 
        if self.get_argument('name') not in users:
              self._template_kwargs['error'] = 'Username does not exist'   
              self.render('login.html', **self._template_kwargs)
        elif users[self.get_argument('name')] == self.get_argument('password'):
              self.set_cookie("logincookie_user", self.get_argument('name'), expires_days=None)
              self.set_cookie("logincookie_password", self.get_argument('password'), expires_days=None)                     
              self.redirect("index.html")
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


class CookieHandler(BaseHandler):  
    def get(self, path):        
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
        (r'/(register)?', RegisterHandler, {'core': core, 'config': config}),
        (r'/(clearcookie)?', CookieHandler, {'core': core, 'config': config}),
        (r'/(notifications)?', NotificationsWebSocket),
        (r'/(.*)', tornado.web.StaticFileHandler, {'path': _STATIC_DIR}),
        
    ]


