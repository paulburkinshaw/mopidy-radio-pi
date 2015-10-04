$(document).ready(function () {


});



var shuffleTracklist = function () {

    window.mopidy.tracklist.getTracks()
                // => tracklist
                .then(function (tracklist) {

                    mopidy.playback.getCurrentTlTrack({}).then(function (currentTlTrack) {

                        mopidy.tracklist.index({ "tl_track": currentTlTrack }).then(function (currentTlTrackIndex) {

                            //shuffle tracklist starting from 4 after the current track so:
                            // currentTlTrackIndex = current track (dont shuffle)
                            // currentTlTrackIndex +1 = next track (dont shuffle)
                            // currentTlTrackIndex +2 = 2nd next track (dont shuffle)
                            // currentTlTrackIndex +3 = 3rd next track (can be shuffled)
                            if (tracklist.length > 4) {

                                mopidy.tracklist.shuffle({ "start": (currentTlTrackIndex + 4), "end": tracklist.length }).then(function (data) {

                                });
                            }
                        });

                    });
                });
}

var PrintTracklist = function () {

    window.mopidy.tracklist.getTracks()
         .then(function (tracklist) {
             $("#tblTracklist").find("tr:gt(0)").remove();
             for (var i = 0; i < tracklist.length; ++i) {
                 if (tracklist[i].artists != null) {
                     $('#tblTracklist tr:last').after('<tr><td>' + tracklist[i].name + '</td><td>' + tracklist[i].artists[0].name + '</td><td><input type="button" value="X" style="font-size:10px" onclick=RemoveTrackFromTracklist(' + i + ') /></td></tr>');
                 }
                 else {
                     $('#tblTracklist tr:last').after('<tr><td>' + tracklist[i].name + '</td><td>&nbsp</td><td><input type="button" value="X" style="font-size:10px" onclick=RemoveTrackFromTracklist(' + i + ') /></td></tr>');

                 }
             }
         });


}