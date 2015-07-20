****************************
Web Sockets
****************************

WebSockets allow for bidirectional communication between the browser and server.
We use Tornado's implementation of the WebSocket protocol - tornado.websocket 

WebSockets are a good choice for two-way, long-running communication without having to support the request-response process.

Usage of WebSockets in Radio-Pi
===============================

WebSockets are ideal candidates for the server sending notifications to a listening browser.
We can take advantage of this and send notifications when events occur such as:-
	- A track was liked 
	- A vote to skip request was recieved for the current track  
	- A new track was requested


Links
=====
https://w3c.github.io/websockets/