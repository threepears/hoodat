app.controller("MasterControl", ["$scope", "$rootScope", "$location", "$firebaseArray", "FindMusic", "Keys", "$anchorScroll", "Authenticate", "$sce", function($scope, $rootScope, $location, $firebaseArray, findmusic, keys, $anchorScroll, Authenticate, $sce) {


	/* Assign Master Control variables */
	var rovi = keys.getRovi();
	var roviSecret = keys.getRoviSecret();
	var homeText = "<p>To save your searches, <a href='#/login'>login</a> or <a href='#/register'>register</a> today!</p>"
	$rootScope.loggedIn = false;
	$scope.home = true;
	$scope.results = false;
	$scope.videoResults = true;
	$scope.searchInProgress = true;
	$scope.searchData = "";
	$scope.artistName = "";
	$scope.artistList = "";
	$scope.artistPhoto = "";
	$scope.artistBio = "";
	$scope.searchText = "Search For An Artist";
	$scope.loginMessage = "PLEASE LOGIN";
	$scope.homeMessage = $sce.trustAsHtml(homeText);
	


	$scope.returnKey = function(keyEvent) {
		console.log("Begin");
        if (keyEvent.which === 13) {
        	console.log("Inside");
        	$scope.search();
    	}
    };


    $scope.navreturnKey = function(keyEvent) {
		console.log("Begin");
        if (keyEvent.which === 13) {
        	console.log("Inside");
        	$scope.search();
        	$scope.closeNav();
    	}
    };



	/* Collapse mobile nav menu when link clicked */
	$(document).ready(function () {
	    $(".navbar-nav li").click(function(event) {
	        $(".navbar-collapse").collapse('hide');
	    });
	});


	/* Generate authorization for Rovi API */
/*	var genSig = function() {
        var curdate = new Date();
        var gmtstring = curdate.toGMTString();
        var utc = Date.parse(gmtstring) / 1000;
        return hex_md5(rovi + roviSecret + utc);
    }*/


	/* Reset placeholder text in dropdown search box */
	$scope.resetSearch = function() {
		$scope.searchData = "";
	};


/*	$scope.gotoAnchor = function(anchor) {
		$(document).scrollTop( $("#discography").offset().top );  
	};*/


	$scope.closeNav = function() {
    	var navbar_toggle = $(".navbar-toggle");
    	/*$('.navbar-toggle').click();*/
    	/*$('.nav-collapse').dropdown();*/
    	/*angular.element('.navbar-toggle').hide();*/
    	/*$('.navbar-collapse').collapse('hide');*/
    	if ($('.navbar-collapse').is(':visible')) {
    		navbar_toggle.trigger('click');
    	}
    };


    /* Perform artist searches: bio, discography, and videos */
	$scope.search = function() {

		var artist = $scope.searchData;
		console.log(artist);

		$scope.searchInProgress = true;
		$scope.saveArtistButton = "Save This Artist";
		$scope.savedArtist = false;

		console.log($location.path);

		$location.path('/main').replace();

		if ($rootScope.loggedIn === true) {
			var userUid = Authenticate.getUid();
			console.log("Got UID");

			var userRef = new Firebase("https://hoodat.firebaseio.com/users/" + userUid + "/artists/");

			var listOfArtists = $firebaseArray(userRef);

			listOfArtists.$loaded()
			.then(function() {
				console.log(listOfArtists);
				console.log(listOfArtists.length);
				
				listOfArtists.forEach( function (arrayItem) {
					var x = arrayItem;
					console.log(x);
				})
			})


			/*for (var i = 0; i < 5; i++) {
				console.log(i);
				console.log(listOfArtists[i]);
				console.log(listOfArtists[i].$value);
				if (listOfArtists[i].$value === artist) {

				}
			}*/

			/*if (artist === userRef) {
				$scope.$parent.saveArtistButton = "Artist Saved!"
				$scope.$parent.savedArtist = true;
			}*/
		}

		console.log($location.path);

		var makeInquiry = findmusic.getMusician(artist);
		makeInquiry.then(function(response) {

			console.log(response);
			
			console.log(response.data.artist.name);
			console.log(response.data.artist.image[4]["#text"]);

		    $scope.artistName = response.data.artist.name;
			$scope.artistPhoto = response.data.artist.image[4]["#text"];

			var artistbio = response.data.artist.bio.summary;
			var longartistbio = response.data.artist.bio.content;

			var end = artistbio.indexOf("<a href");

			var end2 = artistbio.indexOf("Read more on");

			$scope.artistBio = artistbio.slice(0, end);

			$scope.home = false;
			$scope.results = true;

		}, function(reason) {
			alert("Failed: " + reason);
		});


		var makeAlbumInquiry = findmusic.getAlbums(artist);
		makeAlbumInquiry.then(function(response) {

			console.log(response);

			$scope.allAlbums = response.data.topalbums.album;

		}, function(reason) {
			alert("Failed: " + reason);
		});


		var makeVideoInquiry = findmusic.getVideos(artist);
		makeVideoInquiry.then(function(response) {

			console.log(response.data.items);

			$scope.allVideos = response.data.items;

			$scope.getIframeSrc = function (videoId) {
			  return 'https://www.youtube.com/embed/' + videoId;
			};
	
		}, function(reason) {
			$scope.videoResults = false;
			$scope.error = "Sorry...no videos for this artist!";
		});


		var makeSpotifyInquiry = findmusic.getSpotifyArtist(artist);
		var makeSpotifyAlbumInquiry = findmusic.getSpotifyAlbums(artistID);

		makeSpotifyInquiry.then(function(response) {
			makeSpotifyAlbumInquiry(response).then(function(response) {

				console.log(response);


			})


			}, function(reason) {
				$scope.error = "Sorry...no albums for this artist!";
	
		}, function(reason) {
			console.log(error);
		});


/*		var signature = genSig();
      	console.log(signature);

		var makeInfoInquiry = findmusic.getOtherInfo(artist, signature);
		makeInfoInquiry.then(function(response) {

			console.log(response);

	
		}, function(reason) {
			alert("Failed: " + reason);
		});*/

	};


	/* Get the list of user's past artist searches */
	$scope.getPastArtists = function() {
		console.log("WHAT?");
		var user = Authenticate.getUid();

		var userRef = new Firebase("https://hoodat.firebaseio.com/users/" + user + "/artists/");

		console.log(userRef);
		$scope.artistList = $firebaseArray(userRef);
		console.log($scope.artistList);
		$location.path('/pastsearches').replace();
	}


	/* Log out user */
	$scope.logout = function() {
		Authenticate.getFirebase().$unauth();
	    $scope.authData = null;
	    $rootScope.loggedIn = false;
	    $scope.user = {};
	    console.log("No longer logged in?");
	    $scope.homeMessage = "You are now successfully logged out!";
	    /*$location.path('/main').replace();*/
	};



}]);