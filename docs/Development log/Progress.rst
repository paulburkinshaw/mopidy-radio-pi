****************************
Progress
****************************

The purpose of this page is to provide a development log of the Radio Pi Mopidy Web server extension
Hopefully this will help other extension developers who want to do something similar

Useful info
===========
- Mopidy is running as a service on the pi
	- To stop / start / restart the service run: sudo service mopidy [stop / start / restart]
- The Mopidy config and logging cofig is in: /etc/mopidy
- The log files for Mopidy are saved in: /var/log/mopidy/mopidy.log 

Step 1 - Research & project setup
=================================
- Read through Extension development guide: https://docs.mopidy.com/en/latest/extensiondev/
- Looked at other Web Extensions: https://docs.mopidy.com/en/latest/ext/web/ 
- Installed cookiecutter project template generator on the pi https://github.com/mopidy/cookiecutter-mopidy-ext
	- ran the command cookiecutter https://github.com/mopidy/cookiecutter-mopidy-ext.git
		- filled in relevant info for each question such as dist_name and repo_name
- Created a Git repo from the generated project and uploaded to GitHub: https://github.com/paulburkinshaw/mopidy-radio-pi

Step 2 - Delving into the HTTP server side API  
==============================================
The Mopidy-HTTP extension comes with an HTTP server to host Mopidy�s HTTP JSON-RPC API (as of Mopidy 0.19). 
This web server can also be used by other extensions that need to expose something over HTTP

The HTTP server side API can be used to:
	- Host static files for e.g. a Mopidy client written in pure JavaScript
	- Host a Tornado application

Step 2.2 - Hosting a static file
================================
-  Registered an http:static dictionary in the extension registry
	- In ~\mopidy-radio-pi\mopidy_radio_pi\__init__.py setup
	- Set the path to ~\mopidy-radio-pi\mopidy_radio_pi\static\

Step 2.3 - Hosting a Tornado application
========================================
- Registered a dictionary under the http:app key in the extension registry
	- In ~\mopidy-radio-pi\mopidy_radio_pi\__init__.py setup
	- Set the factory to radio_pi_factory 
- Created a file called app.py in ~\mopidy-radio-pi\mopidy_radio_pi\
	- Created a function called radio_pi_factory that accepts two arguments - config and core

- 

Running extension while developing
==================================
Once your extension is ready to go, to see it in action you�ll need to register it with Mopidy. 
Typically this is done by running python setup.py install from your extension�s Git repo root directory. 
While developing your extension however you can instead run python setup.py develop to effectively link Mopidy directly with your development files.
This will create a file:-Mopidy-Radio-Pi.egg-link in /usr/local/lib/python2.7/dist-packages which links Mopidy to the files in home/pi/radio-pi-development_version/mopidy-radio-pi 

While being developed the solution files have been dropped into:
	- home/pi/radio-pi-development_version/mopidy-radio-pi 

in ssh navigate to the above path and run sudo python setup.py develop 
you will need to restart the Mopidy service for changes to take effect:- sudo service mopidy restart





