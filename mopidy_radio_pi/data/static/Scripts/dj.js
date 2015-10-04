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
                                    console.log(data);
                                });

                            }

                        });

                    });

                });



}
