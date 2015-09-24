$(document).ready(function () {

    $("#txtSearch").on("focus", function () {
        if ($("#txtSearch").val() == 'Search...') {
            $("#txtSearch").val('');
        }
    });

    var progressbar = $("#searchResultsProgress"),
      progressLabel = $(".progress-label"),
      progressbarValue = progressbar.find(".ui-progressbar-value");

    progressbar.progressbar({
        value: false,
        change: function () {
            //progressLabel.text(progressbar.progressbar("value") + "%");
        },
        complete: function () {
            //progressLabel.text("Complete!");
        }
    });

    progressbar.hide();

    addTrackDialogue = $("#dialog-addTrack").dialog({
        autoOpen: false,
        resizable: false,
        draggable: true,
        modal: true
        //buttons: {
        //    "Add track": addTrackToTracklist,
        //    Cancel: function () {
        //        addTrackDialogue.dialog("close");
        //    }
        //},
        //close: function () {
        //    form[0].reset();
        //} 
    });

});


var overlayclickclose = function () {
    $('#dialog-addTrack').dialog('close');
}

var addTrackToTracklist = function (uri) {
    alert('adding ' + $('#hdnTrackUri').val());
}




var search = function () {
    var searchTerm = $('#txtSearch').val();

    $('#loading').show();

    mopidy.library.search({
        any: searchTerm,
        uris: ['spotify:']
    }).then(processSearchResults, console.error);

}

var processSearchResults = function (resultArr) {
    
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

                var trackTitle = TruncateString(results.tracks[i].name, 36, 34);
                var albumTitle = TruncateString(results.tracks[i].album.name, 36, 34);
                var artistTitle = TruncateString(results.tracks[i].album.artists[0].name, 25, 22);
              
                var image = mopidy.library.getImages({ uris: [results.tracks[i].uri] }).then(function (data) {

                    $("#searchResultsProgress").progressbar("value", i + 1);
                    $("#searchResults").append("<div class='resultsItem' id='searchResult-" + i + "'> \
                                                    <ul> \
                                                        <li class='riNumber'>"+ (i + 1) + "</li> \
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

                    $("#searchResult-" + i).on("click", function () {
                        addTrackDialogue.dialog("open");

                        hdnTrackUri = addTrackDialogue.find("#hdnTrackUri");
                        hdnTrackUri.val(results.tracks[i].uri);

                        //dialogDiv = addTrackDialogue.find("div");

                        dialogImage = addTrackDialogue.find("#dialogImage");
                        dialogImage.attr("src", data[results.tracks[i].uri][2].uri);

                        dialogTrackName = addTrackDialogue.find("#dialogTrackName");
                        dialogTrackName.html(trackTitle);

                        dialogAlbumName = addTrackDialogue.find("#dialogAlbumName");
                        dialogAlbumName.html(albumTitle);

                        dialogTrackTime = addTrackDialogue.find("#dialogTrackTime");
                        dialogTrackTime.html(trackLength);
                        
                        dialogArtistName = addTrackDialogue.find("#dialogArtistName");
                        dialogArtistName.html(artistTitle);

                        //dialogDiv.show();

                    });

                    $('#loading').hide();

                    if (i == 19)
                    {
                        $("#searchResultsProgress").hide();
                    }

                });
            })(i);
        }
        
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

