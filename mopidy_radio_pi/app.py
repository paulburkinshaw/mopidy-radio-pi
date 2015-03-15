from __future__ import unicode_literals

import logging
import os

import tornado.locale
import tornado.web

_DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
_LOCALE_DIR = os.path.join(_DATA_DIR, 'locale')
_STATIC_DIR = os.path.join(_DATA_DIR, 'static')
_TEMPLATE_DIR = os.path.join(_DATA_DIR, 'template')

logger = logging.getLogger(__name__)


class IndexHandler(tornado.web.RequestHandler):

    DOMAIN = 'radiopi'

    def initialize(self, core, config):
        from . import Extension
        self._template_kwargs = {
            'title': 'radioPi'
        }
        self.core = core

    def get(self, path):
        return self.render('index.html', **self._template_kwargs)


def radio_pi_factory(config, core):
    return [
        (r'/(index.html)?', IndexHandler, {'core': core, 'config': config}),
        (r'/(.*)', tornado.web.StaticFileHandler, {'path': _STATIC_DIR})
    ]
