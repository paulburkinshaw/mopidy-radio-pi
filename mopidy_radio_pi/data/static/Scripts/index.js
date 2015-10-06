$(document).ready(function () {
    mopidy = null;
    _hostname = null;
    // Connect to Mopidy
    ConnectToMopidy();

    $('#login-dialog').dialog({
        autoOpen: false,
        resizable: false,
        draggable: true,
        modal: true

    });

    $('#loggedOut').click(function () {
        $('#login-dialog').dialog('open');
    });

    $("#loginButnImg").click(function () {
        $("#loginForm").submit();
    });
   

});


var loginClose = function () {
    $('#login-dialog').dialog('close');
}

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

            // get random mode
            //GetMode();

            GetCurrentTrack();
            GetNextTracks();
            
            mopidy.playback.getState({}).then(function (state) {
                switch (state) {
                    case "playing":
                        
                        break;
                    case "stopped":
                        
                        break;
                    case "paused":
                        
                        break;
                }
            });

            mopidy.on("event:playbackStateChanged", function (data) {
                switch (data["new_state"]) {
                    case "stopped":
                       
                        break;
                    case "playing":

                        GetCurrentTrack();

                        GetNextTracks();

                        shuffleTracklist();

                        PrintTracklist();
                        
                        break;
                    case "paused":
                        
                        break;
                }
            });

            window.mopidy.on("event:tracklistChanged", function (data) {
               
                GetNextTracks();
                
                PrintTracklist();
                        
                //mopidy.tracklist.getLength({}).then(function (data) {
                //    $('#trackCount').html(data);
                //});

            });
                

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


var GetCurrentTrack = function () {

    mopidy.playback.getCurrentTlTrack({}).then(function (data) {      
        var currentTrack = data.track;
        var date = new Date(currentTrack.length);
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var trackLength = m + ':' + s;

        var trackTitle = TruncateString(data.track.name, 41, 38);
        var albumTitle = TruncateString(data.track.album.name, 22, 19);
        var artistTitle = TruncateString(data.track.album.artists[0].name, 25, 22);

        mopidy.library.getImages({ uris: [currentTrack.uri] }).then(function (data) {
            $('#currentTrackImg').attr("src", data[currentTrack.uri][1].uri);
            $('#currentTrackArtist').html(artistTitle);
            $('#currentTrackTitle').html(trackTitle);                     
        });


    });

}

var GetNextTracks = function (currentTrackUri) {

    $('#upnextItem1_img').attr("src", '');
    $('#upnextItem1_artist').html('');
    $('#upnextItem1_trackName').html('');
    $('#upnextItem1_albumName').html('');

    $('#upnextItem2_img').attr("src", '');
    $('#upnextItem2_artist').html('');
    $('#upnextItem2_trackName').html('');
    $('#upnextItem2_albumName').html('');

    $('#upnextItem3_img').attr("src", '');
    $('#upnextItem3_artist').html('');
    $('#upnextItem3_trackName').html('');
    $('#upnextItem3_albumName').html('');



    mopidy.playback.getCurrentTlTrack({}).then(function (data) {


        // Next Track
        mopidy.tracklist.nextTrack({ "tl_track": data }).then(function (data) {
            if (data != null) {
                var upnextItem1TlTrack = data;
                var upnextItem1Track = data.track;
                var date = new Date(upnextItem1Track.length);
                var h = date.getHours();
                var m = date.getMinutes();
                var s = date.getSeconds();
                var trackLength = m + ':' + s;

                var trackTitle = TruncateString(data.track.name, 35, 32);
                var albumTitle = TruncateString(data.track.album.name, 22, 19);
                var artistTitle = TruncateString(data.track.album.artists[0].name, 23, 22);

                mopidy.library.getImages({ uris: [upnextItem1Track.uri] }).then(function (data) {

                    $('#upnextItem1_img').attr("src", data[upnextItem1Track.uri][1].uri);

                    $('#upnextItem1_artist').html(artistTitle);
                    $('#upnextItem1_trackName').html(trackTitle);
                    $('#upnextItem1_albumName').html(albumTitle);
                    //$('#upnextItem1_trackTime').html(data.track.name);
                });

                // 2nd next Track
                mopidy.tracklist.nextTrack({ "tl_track": upnextItem1TlTrack }).then(function (data) {
                    if (data != null) {
                        var upnextItem2TlTrack = data;
                        var upnextItem2Track = data.track;
                        var date = new Date(upnextItem2Track.length);
                        var h = date.getHours();
                        var m = date.getMinutes();
                        var s = date.getSeconds();
                        var trackLength = m + ':' + s;

                        var trackTitle = TruncateString(data.track.name, 35, 32);
                        var albumTitle = TruncateString(data.track.album.name, 22, 19);
                        var artistTitle = TruncateString(data.track.album.artists[0].name, 23, 22);

                        mopidy.library.getImages({ uris: [upnextItem2Track.uri] }).then(function (data) {

                            $('#upnextItem2_img').attr("src", data[upnextItem2Track.uri][1].uri);

                            $('#upnextItem2_artist').html(artistTitle);
                            $('#upnextItem2_trackName').html(trackTitle);
                            $('#upnextItem2_albumName').html(albumTitle);
                            //$('#upnextItem1_trackTime').html(data.track.name);
                        });

                        // 3rd next Track
                        mopidy.tracklist.nextTrack({ "tl_track": upnextItem2TlTrack }).then(function (data) {
                            if (data != null) {
                                var upnextItem3TlTrack = data;
                                var upnextItem3Track = data.track;
                                var date = new Date(upnextItem3Track.length);
                                var h = date.getHours();
                                var m = date.getMinutes();
                                var s = date.getSeconds();
                                var trackLength = m + ':' + s;

                                var trackTitle = TruncateString(data.track.name, 35, 32);
                                var albumTitle = TruncateString(data.track.album.name, 22, 19);
                                var artistTitle = TruncateString(data.track.album.artists[0].name, 23, 22);

                                mopidy.library.getImages({ uris: [upnextItem3Track.uri] }).then(function (data) {

                                    $('#upnextItem3_img').attr("src", data[upnextItem3Track.uri][1].uri);

                                    $('#upnextItem3_artist').html(artistTitle);
                                    $('#upnextItem3_trackName').html(trackTitle);
                                    $('#upnextItem3_albumName').html(albumTitle);
                                    //$('#upnextItem1_trackTime').html(data.track.name);
                                });

                            }//eo if there is a 3rd next track
                        }); //eo 3rd next track
                    }//eo if there is a 2nd next track
                }); //eo 2nd next track
            } //eo if there is a next track
        });//eo next track
    });//eo current track



}







var GetMode = function()
{
    mopidy.tracklist.getRandom({}).then(function (randomMode) {
        if (randomMode == false) {
            mopidy.tracklist.setRandom({ "value": 'True' }).then(function (data) {
                console.log(data);
            });
        };
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
