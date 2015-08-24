$(document).ready(function () {

    // Initialize Mopidy
    var mopidy = null;
    try {
        var mopidyip = 'radiopi1';
        var mopidyport = '6680';

        mopidy = new Mopidy({
            webSocketUrl: "ws://" + mopidyip + ":" + mopidyport + "/mopidy/ws", // FOR DEVELOPING 
            callingConvention: 'by-position-or-by-name'
        });
    }
    catch (e) {
        console.log("Connecting with Mopidy failed with the following error message: <br>" + e);

        // Try to connect without a given url
        mopidy = new Mopidy({
            callingConvention: 'by-position-or-by-name'
        });
    }

    mopidy.on(console.log.bind(console));

    mopidy.on("pb state:online", function () {

        console.log("pb state:online");
    });

    mopidy.on("websocket:outgoingMessage", function (event) {

    });
    mopidy.on("websocket:incomingMessage", function (event) {


    });




    function processSearchResults(resultArr) {
        console.log('processSearchResults called');
        if (resultArr.length > 0) {
            console.log('results found');
            console.log(resultArr);

        }
    }

    var startMopidy = function (playlistNum, trackNum) {

        //console.log("state:online");


        //mopidy.library.search({
        //    any: "travis",
        //    uris: ['spotify:']
        //}).then(processSearchResults, console.error);

    }


    mopidy.on("state:online", startMopidy);









});

var wsOpen = false;
var ws = null;

var OpenWebSocket = function () {
    var messageContainer = $('#messages');

    if ("WebSocket" in window) {
        $('#messages').append('WebSocket is supported by your Browser!');
        ws = new WebSocket("ws://192.168.1.66:6680/radio-pi_app/notifications?clientId=" + $('#client').val());
        ws.onopen = function () {           
            wsOpen = true;
            $('#messages').append('</br>WebSocket open..');
        };
        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            var received_msg_obj = jQuery.parseJSON(received_msg);
            $('#messages').append('</br>Message ' + received_msg + ' is received...');

        };
        ws.onclose = function () {
            $('#messages').append('</br>Connection is closed...');
        };
    } else {
        $('#messages').append('</br>WebSocket NOT supported by your Browser!');
    }
}


var SendMessageToWebSocket = function () {
    var messageObj =
        {
            messageType: 'likeTrack',
            trackId: 'sp:abc445xxx',
            messageText: $('#wsMessage').val()
        };
    var messageStr = $.param(messageObj); 

    ws.send(messageStr);

}

var CloseWebSocket = function () {
    ws.close();
}

