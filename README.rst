****************************
Mopidy-Radio-Pi
****************************

.. image:: https://img.shields.io/pypi/v/Mopidy-Radio-Pi.svg?style=flat
    :target: https://pypi.python.org/pypi/Mopidy-Radio-Pi/
    :alt: Latest PyPI version

.. image:: https://img.shields.io/pypi/dm/Mopidy-Radio-Pi.svg?style=flat
    :target: https://pypi.python.org/pypi/Mopidy-Radio-Pi/
    :alt: Number of PyPI downloads

.. image:: https://img.shields.io/travis/paulburkinshaw/mopidy-radio-pi/master.png?style=flat
    :target: https://travis-ci.org/paulburkinshaw/mopidy-radio-pi
    :alt: Travis CI build status

.. image:: https://img.shields.io/coveralls/paulburkinshaw/mopidy-radio-pi/master.svg?style=flat
   :target: https://coveralls.io/r/paulburkinshaw/mopidy-radio-pi?branch=master
   :alt: Test coverage

Online radio HTTP interface for the  `Mopidy <http://www.mopidy.com/>`_ music server


Installation
============

Install by running::

    sudo pip install Mopidy-Radio-Pi

Alternatively, clone the `GitHub repository <https://github.com/paulburkinshaw/mopidy-radio-pi.git>`_ and copy all files from the /dist/ directory to the webclient directory on your server.

Dependencies
============

    Mopidy (see Mopidy website for installation instructions for your OS)
    Mopidy-Spotify - install with sudo apt-get install mopidy-spotify

Configuration
=============

Before starting Mopidy, you must add configuration for
Mopidy-Radio-Pi to your Mopidy configuration file::

    [radio-pi]
    # TODO: Add example of extension config
	
You must also add configuration for Mopidy-Spotify, e.g:

    [spotify]
    enabled = true
    username = yourusername
    password = yourpassword



Project resources
=================

- `Source code <https://github.com/paulburkinshaw/mopidy-radio-pi>`_
- `Issue tracker <https://github.com/paulburkinshaw/mopidy-radio-pi/issues>`_
- `Development branch tarball <https://github.com/paulburkinshaw/mopidy-radio-pi/archive/master.tar.gz#egg=Mopidy-Radio-Pi-dev>`_


Changelog
=========

v0.1.0 (UNRELEASED)
----------------------------------------

- Initial release.
