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

Implementation of WebSockets in Radio-Pi
========================================

There are two parts to working with WebSockets: the client side and the server side. 
A WebSocket-based communication generally involves three steps:
1.Establishing the connection between both sides with a hand shake
2.Requesting that WebSocket server start to listen for communication
3.Transferring data

This is implemented in our app in the following way:

On the client side:
-------------------
- A WebSocket is requested by the browser by creating a WebSocket object and passing in the url e.g:  ws = new WebSocket("ws://192.168.1.66:6680/radio-pi_app/notifications");
	- this opens an HTTP connection to the server
	- the browser then sends an upgrade request to convert to a WebSocket
	- if the upgrade is accepted and processed, and the handshake is completed
	- all communication occurs over a single TCP socket
- onopen, onmessage and onclose event handlers are registered with the WebSocket object

Liking a track
--------------
- User clicks like track button
- The SendMessageToWebSocket() js function is called 
- the send method is called on the WebSocket object
	- the method passes a js object containing messageType: 'likeTrack' and the trackId
- On the server the on_message function is called on the NotificationsWebSocket WebSocketHandler class
- The message is parsed and the like track function is called and the track is liked
- the write_message function is called on the NotificationsWebSocket WebSocketHandler class passing the notification message back to any listening clients that the track was liked
- Back at the client side the onmessage handler is called and the notification is displayed to the user

Links
=====
https://w3c.github.io/websockets/