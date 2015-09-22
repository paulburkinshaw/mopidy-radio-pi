$(document).ready(function () {
    mopidy = null;
    _hostname = null;
    // Connect to Mopidy
    ConnectToMopidy();

});



var set_host = function (hostname) {
    _hostname = hostname
    //_hostname = '192.168.1.66'
}

var ConnectToMopidy = function () {
    set_host('192.168.1.66');
    // Initialize Mopidy
    try {
        mopidy = new Mopidy({
            callingConvention: 'by-position-or-by-name'
        });
    }
    catch (e) {
        console.log("Connecting with Mopidy failed with the following error message: <br>" + e);
    }

    // Subscribe to all events and log them
    //mopidy.on(console.log.bind(console));

    // Hooking up to events

    // Mopidy.js object is connected to the server and ready for method calls,
    mopidy.on("state:online", function () {
        setTimeout(function () {
            $('#spnConnectionStatus').html('Connected');
            $('#dvMainContainer').show();

            //OpenWebSocket();
            //tstAddThreeTracksAndBeginPlaying();

        }, 500);
    });
    mopidy.on("state:offline", function () {
        $('#spnConnectionStatus').html('Offline');
    });
    mopidy.on("state:reconnectionPending", function () {
        $('#spnConnectionStatus').html('Reconnection pending');
    });
    mopidy.on("state:reconnecting", function () {
        $('#spnConnectionStatus').html('Reconnecting');
    });


    mopidy.on("websocket:outgoingMessage", function (event) {

    });
    mopidy.on("websocket:incomingMessage", function (event) {

    });
}




var OpenWebSocket = function () {
    if ("WebSocket" in window) {
        ws = new WebSocket("ws://" + _hostname + ":6680/radio-pi_app/piWs?clientId=" + $('#hdnCurrentUser').val());

        ws.onopen = function () {

        };
        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            var received_msg_obj = jQuery.parseJSON(received_msg);
            console.log(received_msg_obj);
        };
        ws.onclose = function () {

        };
    } else {
        alert('WebSockets NOT supported by your Browser!');
    }
}


// Helper functions

var TruncateString = function (string, maxLength, truncateLength) {
    var truncatedString = '';
    if (string.length > maxLength) {
        truncatedString = jQuery.trim(string).substring(0, truncateLength).split(" ").slice(0, -1).join(" ") + "...";
    }
    else {
        truncatedString = string;
    }

    return truncatedString;
}
