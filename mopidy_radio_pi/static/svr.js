var jsonpAddTrackCallback = function (result) {
    //console.log(result);
}


var jsonpGetTrackCallback = function (result) {
    printUserInfoForTrack(result);
  
}

var jsonpGetTrackRatingCallback = function (result) {
    printTrackRating(result);
}

var jsonpLikeTrackCallback = function (result) {
    if(result.likeAdded == 'false')
	{
		alert(result.failedLikeReason);
	}
	else{
		alert('Track liked');
	}
}

var jsonpVoteToSkipTrackCallback = function (result) {
	if(result.voteAdded == 'false')
	{
		alert(result.failedVoteReason);
	}
	else{
		alert('vote to skip registered');
	}
	
    
}

var jsonpGetTrackVotesCallback = function (result) {
    //skipTrack(result);
}

var jsonpGetTrackVotesAndRatingCallback = function (result) {
	
	skipTrack(result)
	
    //console.log("total votes with skipvcout and rating:" + result.totalTrackVotes);
	//console.log("total votes:" + result.skipVotes);
	//console.log("total rating:" + result.rating);
}

var jsonpGetTrendingTracksCallback = function (result) {
	
	displayTrendingTracks(result);
	
}




var _addTrackToTracklist = function (trackUri, user, dedicate, comments) {
    $.ajax({

        type: 'POST',
        dataType: 'jsonp',	// Loads in a JSON block using JSONP. Adds an extra "?callback=?" to url
        jsonp: 'jsonpAddTrackCallback',	// Override the callback function name in a jsonp request. This value will be used instead of 'callback' in the 'callback=?' part of the query string in the url.
        crossDomain: true,
        cache: false,
        async: true,
        contentType: "application/json",
        url: "http://radiopi:8000/?type=addTrack&trackUri=" + trackUri + "&user=" + user + "&dedicate=" + dedicate + "&comments=" + comments,
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log(jqXHR);
            //console.log(textStatus);
            //alert(errorThrown);
            //console.log(errorThrown);
        },
        success: function (result) {
            //console.log('success : ' + result);
        },
        complete: function (result) {

        }
    });
}


var _getTrack = function (trackUri) {
    $.ajax({

        type: 'POST',
        dataType: 'jsonp',	// Loads in a JSON block using JSONP. Adds an extra "?callback=?" to url
        jsonp: 'jsonpGetTrackCallback',	// Override the callback function name in a jsonp request. This value will be used instead of 'callback' in the 'callback=?' part of the query string in the url.
        crossDomain: true,
        cache: false,
        async: true,
        contentType: "application/json",
        url: "http://radiopi:8000/?type=getTrack&trackUri=" + trackUri,
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log(jqXHR);
            //console.log(textStatus);
            //alert(errorThrown);
            //console.log(errorThrown);
        },
        success: function (result) {
            //console.log('success : ' + result);
        },
        complete: function (result) {

        }
    });
}

var _getTrackRating = function (trackUri) {
    $.ajax({
        type: 'POST',
        dataType: 'jsonp',	
        jsonp: 'jsonpGetTrackRatingCallback',	
        crossDomain: true,
        cache: false,
        async: true,
        contentType: "application/json",
        url: "http://radiopi:8000/?type=getTrackRating&trackUri=" + trackUri,
        error: function (jqXHR, textStatus, errorThrown) {
            
        },
        success: function (result) {
            
        },
        complete: function (result) {

        }
    });
}


var _likeTrack = function (trackUri, trackname, artist, album) {
    $.ajax({

        type: 'POST',
        dataType: 'jsonp',	
        jsonp: 'jsonpLikeTrackCallback',
        crossDomain: true,
        cache: false,
        async: true,
        contentType: "application/json",
        url: "http://radiopi:8000/?type=likeTrack&trackUri=" + trackUri + "&trackname=" + trackname + "&artist=" + artist + "&album=" + album,
        error: function (jqXHR, textStatus, errorThrown) {
          
        },
        success: function (result) {
           
        },
        complete: function (result) {

        }
    });
}

var _voteToSkipTrack = function (trackUri, trackname, artist, album) {
    $.ajax({

        type: 'POST',
        dataType: 'jsonp',	
        jsonp: 'jsonpVoteToSkipTrackCallback',
        crossDomain: true,
        cache: false,
        async: true,
        contentType: "application/json",
        url: "http://radiopi:8000/?type=voteToSkipTrack&trackUri=" + trackUri + "&trackname=" + trackname + "&artist=" + artist + "&album=" + album,
        error: function (jqXHR, textStatus, errorThrown) {
          
        },
        success: function (result) {
           
        },
        complete: function (result) {

        }
    });
}

var _getTrackVotes = function (trackUri) {
    $.ajax({

        type: 'POST',
        dataType: 'jsonp',	
        jsonp: 'jsonpGetTrackVotesCallback',
        crossDomain: true,
        cache: false,
        async: true,
        contentType: "application/json",
        url: "http://radiopi:8000/?type=getTrackVotes&trackUri=" + trackUri,
        error: function (jqXHR, textStatus, errorThrown) {
          
        },
        success: function (result) {
           
        },
        complete: function (result) {

        }
    });
}

var _getTrackVotesAndRating = function (trackUri) {
    $.ajax({

        type: 'POST',
        dataType: 'jsonp',	
        jsonp: 'jsonpGetTrackVotesAndRatingCallback',
        crossDomain: true,
        cache: false,
        async: true,
        contentType: "application/json",
        url: "http://radiopi:8000/?type=getTrackVotesAndRating&trackUri=" + trackUri,
        error: function (jqXHR, textStatus, errorThrown) {
          
        },
        success: function (result) {
           
        },
        complete: function (result) {

        }
    });
}


var _getTrendingTracks = function () {
    $.ajax({

        type: 'POST',
        dataType: 'jsonp',	
        jsonp: 'jsonpGetTrendingTracksCallback',
        crossDomain: true,
        cache: false,
        async: true,
        contentType: "application/json",
        url: "http://radiopi:8000/?type=getTrendingTracks",
        error: function (jqXHR, textStatus, errorThrown) {
          
        },
        success: function (result) {
           
        },
        complete: function (result) {

        }
    });
}



///
// Up / Down vote on track
///
var db_addTrackVote = function (track) {
    if (track) {
        console.log(track);
    }
}

///
// Get number of Up \ Down votes
// If Down votes > 3 then skip track
///
var GetTrackVotes = function (track) {
    if (track) {
        console.log(track);
    }
}

    