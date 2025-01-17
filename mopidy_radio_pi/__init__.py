from __future__ import unicode_literals

import logging
import os

# TODO: Remove entirely if you don't register GStreamer elements below
# import pygst pygst not compatible with Mopidy 2.0
# pygst.require('0.10')
# import gst

import gobject

from mopidy import config, ext



__version__ = '0.1.0'

# TODO: If you need to log, use loggers named after the current Python module
logger = logging.getLogger(__name__)



class Extension(ext.Extension):

    dist_name = 'Mopidy-Radio-Pi'
    ext_name = 'radio-pi'
    version = __version__

    def get_default_config(self):
        conf_file = os.path.join(os.path.dirname(__file__), 'ext.conf')
        return config.read(conf_file)

    #def get_config_schema(self):
    #    schema = super(Extension, self).get_config_schema()
        # TODO: Comment in and edit, or remove entirely
        # schema['username'] = config.String()
        # schema['password'] = config.Secret()
    #    return schema

    def setup(self, registry):
        

        from .app import radio_pi_factory

        registry.add('http:static', {
            'name': 'radiopiv1',
            'path': os.path.join(os.path.dirname(__file__), 'static'),
        })

        registry.add('http:app', {
            'name': self.ext_name + '_app',
            'factory': radio_pi_factory          
        })
