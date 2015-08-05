****************************
Issues
****************************

This page is any issues encountered during development


No sound issue
==============
I first thought this was because the mopidy user that mopidy runs under needed adding to the audio group
	- sudo usermod -a -G audio mopidy

But it was this (taken from: https://docs.mopidy.com/en/latest/installation/raspberrypi/) :

I have a HDMI cable connected, but want the sound on the analog sound connector, I have to run:
	- sudo amixer cset numid=3 1

to force it to use analog output. 1 means analog, 0 means auto, and is the default, while 2 means HDMI. You can test sound output independent of Mopidy by running:
	- aplay /usr/share/sounds/alsa/Front_Center.wav


spotify extension not working
=============================
This turned out to be because the version of the spotify extension was newer than mopidy, it needed mopidy version >= 1.0 and it was version 0.19 of mopidy that was installed, to fix i updated mopidy:-
	- sudo apt-get update
	- sudo apt-get dist-upgrade

