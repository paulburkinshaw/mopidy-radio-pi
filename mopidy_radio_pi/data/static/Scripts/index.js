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


var musixmatchGetArtistId = function(track_title, artist_name)
{
    $.ajax({
        type: 'GET',
        data: {
            apikey: "f7b6e121440dbd2e156be3cd1f4569a4",
            q_track: track_title,
            q_artist: artist_name,
            f_has_lyrics: 1,
            format: "jsonp",
            callback: "jsonp_callback"
        },
        url: "http://api.musixmatch.com/ws/1.1/track.search",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        contentType: 'application/json',
        success: function (data) {
            var track_id = data.message.body.track_list[0].track.track_id;
            musixmatchGetTrackLyrics(track_id);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

var musixmatchGetTrackLyrics = function(track_id)
{
    $.ajax({
        type: 'GET',
        data: {
            apikey: "f7b6e121440dbd2e156be3cd1f4569a4",
            track_id: track_id,           
            format: "jsonp",
            callback: "jsonp_callback"
        },
        url: "http://api.musixmatch.com/ws/1.1/track.lyrics.get",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        contentType: 'application/json',
        success: function (data) {
            
            var lyrics_body = data.message.body.lyrics.lyrics_body;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

}



var loginClose = function () {
    $('#login-dialog').dialog('close');
}

var set_host = function (hostname) {
    _hostname = hostname
    //_hostname = '192.168.1.66'
}

var ConnectToMopidy = function () {
    //set_host('192.168.1.66');
    set_host('radiopi1');
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
    // mopidy.on(console.log.bind(console));

    // Hooking up to events

    // Mopidy.js object is connected to the server and ready for method calls,
    mopidy.on("state:online", function () {
        setTimeout(function () {
            $('#spnConnectionStatus').html('Connected');
            $('#dvMainContainer').show();


            OpenWebSocket();

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
                        $("#like").hide();
                        $("#skip").hide();

                        $("#imgOnAirStatus").attr("src", 'Images/off-air.jpg');
                       
                        break;
                    case "playing":
                        $("#imgOnAirStatus").attr("src", 'Images/on-air.jpg');

                        $("#like").show();
                        $("#skip").show();

                        GetCurrentTrack();

                        GetNextTracks();

                        shuffleTracklist();

                        PrintTracklist();
                        
                        break;
                    case "paused":
                        $("#imgOnAirStatus").attr("src", 'Images/off-air.jpg');
                        $("#like").hide();
                        $("#skip").hide();
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
        $('#like').css({ "background": "url('Images/like-on-off.png')" })

        var currentTrack = data.track;
        var date = new Date(currentTrack.length);
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var trackLength = m + ':' + s;

        var trackUri = data.track.uri;
        var trackTitle = TruncateString(data.track.name, 41, 38);
        var albumTitle = TruncateString(data.track.album.name, 22, 19);
        var artistTitle = TruncateString(data.track.album.artists[0].name, 25, 22);
        var artistTitleLyrics = TruncateString(data.track.album.artists[0].name, 35, 34);

        mopidy.library.getImages({ uris: [currentTrack.uri] }).then(function (data) {
            $('#currentTrackImg').attr("src", data[currentTrack.uri][1].uri);
            $('#currentTrackArtist').html(artistTitle);
            $('#currentTrackTitle').html(trackTitle);                     
        });


        // Make ajax request to get requestor, any comments \ dedication ect
        // TODO: refactor this, to WebSockets

        $.ajax({
            type: 'GET',
            data: {
                trackUri: "['"+trackUri+"']"
            },
            url: "getTrack",
            dataType: "JSON",
            success: function (data) {             
                var requestedBy = data.ChosenBy.replace("['", "").replace("']", "");              
                $('#dvRequestedBy').html(requestedBy);
                var dedicatedTo = data.DedicatedTo.replace("['", "").replace("']", "");
                $('#dvDedicatedTo').html(dedicatedTo);
                var comments = data.Comments.replace("['", "").replace("']", "");
                $('#dvComments').html(comments);
                
               
                // clear the vote icons
                for (var i = 1; i <= 10 ; ++i) {
                    $('#vote_' + i).html('<img src="Images/note-off.png">')
                }

                var trackRating = data.noOfLikes - data.noOfSkips;

                if (trackRating > 0) {
                    for (var i = 1; i <= trackRating ; ++i) {
                        $('#vote_' + i).html('<img src="Images/note-on.png">')
                    }
                }
                // TODO: skip vote icons

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });

       

        // Call musixmatch API to get track lyrics to display on banner
        $.ajax({
            type: 'GET',
            data: {
                apikey: "f7b6e121440dbd2e156be3cd1f4569a4",
                q_track: trackTitle,
                q_artist: artistTitleLyrics,
                f_has_lyrics: 1,
                format: "jsonp",
                callback: "jsonp_callback"
            },
            url: "http://api.musixmatch.com/ws/1.1/track.search",
            dataType: "jsonp",
            jsonpCallback: 'jsonp_callback',
            contentType: 'application/json',
            success: function (data) {
                var track_id = data.message.body.track_list[0].track.track_id;
                $.ajax({
                    type: 'GET',
                    data: {
                        apikey: "f7b6e121440dbd2e156be3cd1f4569a4",
                        track_id: track_id,
                        format: "jsonp",
                        callback: "jsonp_callback"
                    },
                    url: "http://api.musixmatch.com/ws/1.1/track.lyrics.get",
                    dataType: "jsonp",
                    jsonpCallback: 'jsonp_callback',
                    contentType: 'application/json',
                    success: function (data) {
                        var lyrics_body = data.message.body.lyrics.lyrics_body;
                    
                        var firstP = lyrics_body.substring(0, lyrics_body.indexOf("\n\n"));

                        var bannerLyrics = '"' + firstP + '"';

                        bannerLyrics += '<br>';
                        bannerLyrics += '<div style="padding-top:5px;">';
                        bannerLyrics += '- ' + artistTitleLyrics;
                        bannerLyrics += '</div>';

                        $('#nivoCaption1').html(bannerLyrics);

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
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

  
    $('#upLaterItem1_artist').html('');
    $('#upLaterItem2_artist').html('');


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
                        //var artistTitle = TruncateString(data.track.album.artists[0].name, 23, 22);
                        var artistTitle = TruncateString(data.track.album.artists[0].name, 33, 32);

                        mopidy.library.getImages({ uris: [upnextItem2Track.uri] }).then(function (data) {

                            //$('#upnextItem2_img').attr("src", data[upnextItem2Track.uri][1].uri);

                            $('#upLaterItem1_img').attr("src", data[upnextItem2Track.uri][1].uri);
                            $('#upLaterItem1_artist').html(artistTitle);

                            //$('#upnextItem2_trackName').html(trackTitle);
                            //$('#upnextItem2_albumName').html(albumTitle);
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
                                //var artistTitle = TruncateString(data.track.album.artists[0].name, 23, 22);
                                var artistTitle = TruncateString(data.track.album.artists[0].name, 33, 32);

                                mopidy.library.getImages({ uris: [upnextItem3Track.uri] }).then(function (data) {

                                    //$('#upnextItem3_img').attr("src", data[upnextItem3Track.uri][1].uri);

                                    $('#upLaterItem2_img').attr("src", data[upnextItem3Track.uri][1].uri);
                                    $('#upLaterItem2_artist').html(artistTitle);
                                    //$('#upnextItem3_trackName').html(trackTitle);
                                   // $('#upnextItem3_albumName').html(albumTitle);
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


// Web socket functions

/* 
- method - A String containing the name of the method to be invoked.
- params - An Array of objects to pass as arguments to the method.
- id - The request id. This can be of any type. It is used to match the response with the request that it is replying to.


{"method":"core.playback.get_state","params":{},"jsonrpc":"2.0","id":3}
{"jsonrpc": "2.0", "id": 3, "result": "stopped"}


"id":0 can be used to indicate the response can go to all clients

{"method":"likeTrack","params":[{"trackUri":data.track.uri}, {"trackName":data.track.uri}, {"artistName":data.track.uri}, {"albumName":data.track.uri}],"id":0}

{"pburkinshaw": {"clientId": "pburkinshaw"}}

*/

var OpenWebSocket = function () {
    if ("WebSocket" in window) {
        ws = new WebSocket("ws://" + _hostname + ":6680/radio-pi_app/piWs?clientId=" + $('#hdnCurrentUser').val());

        ws.onopen = function () {

        };
        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            var received_msg_obj = jQuery.parseJSON(received_msg);
            

            if (received_msg_obj.notificationType != null)
            {
                // Track like
                if (received_msg_obj.notificationType == 'trackLiked') {
                    if (received_msg_obj.trackUri != null) {                       
                        var trackUri = received_msg_obj.trackUri.toString();

                        // clear the vote icons
                        for (var i = 1; i <= 10 ; ++i) {
                            $('#vote_' + i).html('<img src="Images/note-off.png">')
                        }

                        var trackRating = received_msg_obj.noOfLikes - received_msg_obj.noOfSkips;

                        if (trackRating > 0) {
                            for (var i = 1; i <= trackRating ; ++i) {                               
                                $('#vote_' + i).html('<img src="Images/note-on.png">')
                            }
                        }
                        // TODO: skip vote icons
                    }
                }


                // News feed
                if (received_msg_obj.notificationType == 'newsFeed') {
                    //First loop through existing news feed items and update the time
                    $('.newsFeedItem').each(function () {
                        var t2 = new Date().getTime();
                        var t1 = new Date($(this).find('.feedTime').attr('date')).getTime();
                        var theDiff = Math.abs(t1 - t2) / 3600000;
                        if (theDiff < 1) {
                            $(this).find('.feedTime').html('< 1h');
                        }
                        else {
                            $(this).find('.feedTime').html(parseInt(theDiff) + 'h');                           
                        }
                    });
                    
                    // insert a new newsfeed item at the start
                    if ($('.newsFeedItem').first().length > 0)
                    {
                        $('.newsFeedItem').first().before(received_msg_obj.feedItemHtml);
                    }
                    else
                    {
                        $('#newsFeed').append(received_msg_obj.feedItemHtml);
                    }


                    // Create notification                   
                    Notification.requestPermission().then(function (result) {
                        if (result === 'denied') {                           
                            return;
                        }
                        if (result === 'default') {                          
                            return;
                        }
                        var options = {
                            //dir: "ltr",
                            tag: "",
                            body: received_msg_obj.feedItemPlainText,
                            icon: "Images/piIcon.png"
                        }
                        // Do something with the granted permission.
                        var notification = new Notification("Track liked!", options);

                    });
                    

                }


            }

        };
        ws.onclose = function () {

        };
    } else {
        //alert('WebSockets NOT supported by your Browser!');
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







// eo web socket functions


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
