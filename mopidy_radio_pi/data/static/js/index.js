$(document).ready(function () {
    mopidy = null;
    // Connect to Mopidy
    ConnectToMopidy();

    

});

var ConnectToMopidy = function () {
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


            tstAddThreeTracksAndBeginPlaying();

        }, 2000);       
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

var processSearchResults = function(resultArr) {
    console.log('processSearchResults called');
    if (resultArr.length > 0) {
        console.log('results found');
        console.log(resultArr);

    }
}
