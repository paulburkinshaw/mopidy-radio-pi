$(document).ready(function () {

    // Initialize Mopidy
    var mopidy = null;
    try {
        var mopidyip = 'radiopi';
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
        

    });
    mopidy.on("websocket:outgoingMessage", function (event) {     
       
    });
    mopidy.on("websocket:incomingMessage", function (event) {
       
        
    });

  
});