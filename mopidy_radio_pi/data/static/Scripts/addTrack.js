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
    });


    $('#txtSearch').keydown(function (e) {
        var keyCode = e.keyCode || e.which;

        if (keyCode == 13) {
            search();
        }
    });


    $("#like").on("click", function () {

        mopidy.playback.getCurrentTlTrack({}).then(function (data) {
            var currentTrack = data.track;

            $.ajax({
                type: 'POST',
                data: {
                    trackUri: data.track.uri,
                    trackName: data.track.name,
                    artistName: data.track.album.artists[0].name,
                    albumName: data.track.album.name
                },
                url: "likeTrack",
                dataType: "JSON",
                success: function (data) {
                    //console.log(data);
                    if (data.sucess) {
                        $('#like').css({ "background-position-y": "-84px" });
                    }
                    else {
                        //$('a.voteLike').css({ "background": "url('Images/like-on-off.png')" });
                        alert('You have already liked this track');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //console.log(jqXHR);
                    //console.log(textStatus);
                    //console.log(errorThrown);

                }
            });

        });
    });

    $("#skip").on("click", function () {
        console.log('skip');

    });

    $("#like").hide();
    $("#skip").hide();
});


var overlayclickclose = function () {
    $('#dialog-addTrack').dialog('close');
}





var search = function () {
    var searchTerm = $('#txtSearch').val();

    $('#loading').show();

    try {

        mopidy.library.search({
            any: [searchTerm],
            uris: ['spotify:']
        }).then(processSearchResults, console.error);

    }
    catch (err) {
        console.log(err);
    }
}

var processSearchResults = function (resultArr) {

    if (resultArr.length > 0) {
        var results = resultArr[0];

        $("#searchResults").html('');

        $("#searchResultsProgress").show();

        if (results.tracks) {

            if (results.tracks.length < 20) {
                $("#searchResultsProgress").progressbar("option", "max", results.tracks.length);
            }
            else {
                $("#searchResultsProgress").progressbar("option", "max", 20);
            }

            $("#searchResultsProgress").find(".ui-progressbar-value").css({
                "background": '#EAA469'
            });


            for (var i = 0; i < (results.tracks.length) && (i < 20); ++i) {
                (function (i) {

                    var date = new Date(results.tracks[i].length);
                    var h = date.getHours();
                    var m = date.getMinutes();
                    var s = date.getSeconds();
                    var trackLength = m + ':' + s;

                    var trackTitle = TruncateString(results.tracks[i].name, 36, 34);
                    var albumTitle = TruncateString(results.tracks[i].album.name, 36, 34);
                    //var artistTitle = TruncateString(results.tracks[i].album.artists[0].name, 25, 22);

                    var artistTitle = TruncateString(results.tracks[i].artists[0].name, 25, 22);

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

                        });

                        $('#loading').hide();

                        if (i == 19) {
                            $("#searchResultsProgress").hide();
                        }

                    });
                })(i);
            }

        } else {
            console.log('no tracks');
        }

    }
}




var addTrackToTracklistAnon = function (uri) {

    overlayclickclose();

    var trackUri = $('#hdnTrackUri').val();
    var trackName = $('#dialogTrackName').html();
    var dialogArtistName = $('#dialogArtistName').html();
    var dialogAlbumName = $('#dialogAlbumName').html();

    var uris = [trackUri]

    // First check if the track has already been added to tracklist
    mopidy.tracklist.filter({ "uri": uris }).then(function (data) {
        if (data.length < 1) {
            mopidy.tracklist.add({ "tracks": null, "at_position": null, "uri": null, "uris": uris }).then(function (data) {

                // TODO: Add notification modal when track has been added

            });
        }
        else {
            overlayclickclose();
            alert('Track has already been added!');
        }
    });



    mopidy.tracklist.getLength({}).then(function (data) {

    });
}



var addTrackToTracklist = function (uri) {




    var requestorName = $('#txtYourName').val();
    if (requestorName == '') {
        requestorName = ' ';
    }

    var requestorDedicate = $('#txtDedicateTo').val();
    if (requestorDedicate == '') {
        requestorDedicate = ' ';
    }

    var requestorComment = $('#txtTrackComments').val();
    if (requestorComment == '') {
        requestorComment = ' ';
    }

    var trackUri = $('#hdnTrackUri').val();
    var trackName = $('#dialogTrackName').html();
    var dialogArtistName = $('#dialogArtistName').html();
    var dialogAlbumName = $('#dialogAlbumName').html();

    var uris = [trackUri]

    overlayclickclose();

    // First check if the track has already been added to tracklist
    mopidy.tracklist.filter({ "uri": uris }).then(function (data) {
        if (data.length < 1) {
            mopidy.tracklist.add({ "tracks": null, "at_position": null, "uri": null, "uris": uris }).then(function (data) {

                $.ajax({
                    type: 'POST',
                    data: {
                        trackUri: trackUri,
                        trackName: trackName,
                        artistName: dialogArtistName,
                        albumName: dialogAlbumName,
                        requestorName: requestorName,
                        requestorDedicate: requestorDedicate,
                        requestorComment: requestorComment
                    },
                    url: "addTrack",
                    dataType: "JSON",
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });




            });
        }
        else {
            overlayclickclose();
            alert('Track has already been added!');
        }
    });



    mopidy.tracklist.getLength({}).then(function (data) {

    });
}











