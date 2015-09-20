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
        //console.log('results found');
        //console.log(resultArr);
        
        var results = resultArr[0];


        for (var i = 0; i < (results.tracks.length) && (i < 5) ; ++i) {

            (function(i){


                console.log('i : ' + i);
                //var trk = results.tracks[i];
                //var trkUri = trk.uri;


                // var deferred = $.Deferred(); //Create a deferred object


                var image = mopidy.library.getImages({ uris: [results.tracks[i].uri] }).then(function (data) {


                    //var tupleKey = trkUri;
                    //var img = data[tupleKey];


                    console.log('trkUri : ' + results.tracks[i].uri);
                    console.dir('data :' + data);
                    var img = data[results.tracks[i].uri];
                   
                    console.log(img[2]);
                    console.log(img.length);

                    $('#imgArtwork').attr("src", img[2].uri);

                   

                    //deferred.resolve(); //resolve the deferred object


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

function checkFlag(flag) {
    if (flag == false) {
        window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
    } else {
        /* do something*/
    }
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
        ws = new WebSocket("ws://"+_hostname+":6680/radio-pi_app/piWs?clientId=" + $('#hdnCurrentUser').val());

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
