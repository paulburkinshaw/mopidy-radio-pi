$(document).ready(function () {
    mopidy = null;
    _hostname = null;
    // Connect to Mopidy
    ConnectToMopidy();


    $("#txtSearch").on("focus", function () {
        if ($("#txtSearch").val() == 'Search...')
        {
            $("#txtSearch").val('');
        }      
    });

    var progressbar = $("#searchResultsProgress"),        
      progressLabel = $(".progress-label"),
      progressbarValue = progressbar.find(".ui-progressbar-value");

    progressbar.progressbar({
        value: false,
        change: function () {
            progressLabel.text(progressbar.progressbar("value") + "%");
        },
        complete: function () {
            progressLabel.text("Complete!");
        }
    });

    progressbar.hide();

    //$("#searchResultsProgress").progressbar({
    //    max: 20
    //});
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

var search = function () {
    var searchTerm = $('#txtSearch').val();

    mopidy.library.search({
        any: searchTerm,
        uris: ['spotify:']
    }).then(processSearchResults, console.error);

}

var processSearchResults = function (resultArr) {
    console.log('processSearchResults called');
    if (resultArr.length > 0) {
        var results = resultArr[0];

        $("#searchResults").html('');

        $("#searchResultsProgress").show();

        if (results.tracks.length < 20) {
            $("#searchResultsProgress").progressbar("option", "max", results.tracks.length);
        }
        else {
            $("#searchResultsProgress").progressbar("option", "max", 20);        
        }
       
        $("#searchResultsProgress").find(".ui-progressbar-value").css({
            "background": '#EAA469'
        });
        

        for (var i = 0; i < (results.tracks.length) && (i < 20) ; ++i) {
            (function (i) {
                             
                var date = new Date(results.tracks[i].length);
                var h = date.getHours();
                var m = date.getMinutes();
                var s = date.getSeconds();
                var trackLength = m + ':' + s;

                var trackTitle = '';
                var albumTitle = '';
                var artistTitle = '';

                // Check track name length, if greater than 37 truncate
                if (results.tracks[i].name.length > 36)
                {                
                    trackTitle = jQuery.trim(results.tracks[i].name).substring(0, 34).split(" ").slice(0, -1).join(" ") + "...";
                }
                else {
                    trackTitle = results.tracks[i].name;
                }

                if (results.tracks[i].album.name.length > 36) {
                    albumTitle = jQuery.trim(results.tracks[i].album.name).substring(0, 34).split(" ").slice(0, -1).join(" ") + "...";
                }
                else {
                    albumTitle = results.tracks[i].album.name;
                }

                if (results.tracks[i].album.artists[0].name.length > 25) {
                    artistTitle = jQuery.trim(results.tracks[i].album.artists[0].name).substring(0, 22).split(" ").slice(0, -1).join(" ") + "...";
                }
                else {
                    artistTitle = results.tracks[i].album.artists[0].name;
                }

                var image = mopidy.library.getImages({ uris: [results.tracks[i].uri] }).then(function (data) {

                    $("#searchResultsProgress").progressbar("value", i + 1);

                    $("#searchResults").append("<div class='resultsItem'> \
                                                    <ul> \
                                                        <li class='riNumber'>"+ (i + 1) +"</li> \
                                                         <li class='riThumb'><img src='" + data[results.tracks[i].uri][2].uri + "' style='width:46px;height:46px' /></li> \
                                                         <li class='riTrack'> \
                                                             <span class='trackHeader'>" + trackTitle + "</span><br /> \
                                                             <span class='trackAlbum'>" + albumTitle + "</span> \
                                                         </li> \
                                                         <li class='riArtist'> \
                                                            <span class='trackHeader'>" + artistTitle + "</span><br /> \
                                                            <span>Year:" + results.tracks[i].album.date + "</span> \
                                                         </li> \
                                                        <li class='riTime'> \
                                                            <span class='trackHeader'></span><br /> \
                                                            <span>Time:" + trackLength + "</span> \
                                                         </li> \
                                                    </ul> \
                                                </div>");


                });
            })(i);
        }
    }
}

function asyncEvent() {
    var dfd = jQuery.Deferred();

    // Return the Promise so caller can't change the Deferred
    return dfd.promise();
}


// Development method used to add a few tracks and start playing them so we have something to work with
var tstAddThreeTracksAndBeginPlaying = function () {

    //mopidy.library.search({
    //    any: "travis",
    //    uris: ['spotify:']
    //}).then(processSearchResults, console.error);

    //var aTrack = {};
    //aTrack.__model__ = "Track";
    //aTrack.track_no = 7;
    //aTrack.name = "Why Does It Always Rain On Me?";
    //aTrack.uri = 'spotify:track:6JXD70ZqUhx02AteE50CIS';
    //var dummyTracks = { 'tracks': [], 'artists': [], 'albums': [] };
    //dummyTracks['tracks'] = dummyTracks['tracks'].concat(aTrack);

    //mopidy.tracklist.add(dummyTracks.tracks);

    var uris = ['spotify:track:6JXD70ZqUhx02AteE50CIS', 'spotify:track:01p5NB0mgtrEFM7hXlcLDd', 'spotify:track:18ADNI1zYXdedfooug68SQ', 'spotify:track:2LM9J5szSxGVYs3Mi33rBW']

    mopidy.tracklist.add({ "tracks": null, "at_position": null, "uri": null, "uris": uris }).then(function (data) {
        console.log(data);
    });

    mopidy.tracklist.getLength({}).then(function (data) {
        console.log(data);
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
