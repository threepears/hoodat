app.controller("MasterControl", ["$scope", "$rootScope", "$location", "$firebaseArray", "FindMusic", "Keys", "$anchorScroll", "Authenticate", "$sce", function($scope, $rootScope, $location, $firebaseArray, findmusic, keys, $anchorScroll, Authenticate, $sce) {


	/* Assign Master Control variables */
	var rovi = keys.getRovi();
	var roviSecret = keys.getRoviSecret();
	var homeText = "<p>To save your searches, <a href='#/login'>login</a> or <a href='#/register'>register</a> today!</p>";
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
	$scope.searchErrorMessage = null;
	$scope.homeMessage = $sce.trustAsHtml(homeText);


	$scope.$on('LastRepeaterElement', function() {
    $( ".frames" ).wrap( "<div class='frameContainer'></div>" );
    $('.frameContainer:not(:has(.frames))').css('display', 'none');
	});


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
	var genSig = function() {
    var curdate = new Date();
    var gmtstring = curdate.toGMTString();
    var utc = Date.parse(gmtstring) / 1000;
    return hex_md5(rovi + roviSecret + utc);
   }


	/* Reset placeholder text in dropdown search box */
	$scope.resetSearch = function() {
		$scope.searchData = "";
	};


	$scope.closeNav = function() {
  	var navbar_toggle = $(".navbar-toggle");

  	if ($('.navbar-collapse').is(':visible')) {
  		navbar_toggle.trigger('click');
  	}
  };

  $scope.returnHome = function() {
  		$scope.home = true;
			$scope.results = false;
			$scope.searchData = "";
  }


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
				var artistPresent = false;

				listOfArtists.forEach( function (arrayItem) {
					var x = arrayItem;
					console.log(artist.toLowerCase());
					console.log(x.$value.toLowerCase());

					if (x.$value.toLowerCase() === artist.toLowerCase()) {
						console.log(x.$value, artist);
						artistPresent = true;
					}
				})

				console.log(artistPresent);

				if (artistPresent === true) {
					console.log("IT'S TRUE!!!");
					$scope.saveArtistButton = "Artist Saved!"
					$scope.savedArtist = true;
				}
			})
		}


		// var makeInquiry = findmusic.getMusician(artist);
		// makeInquiry.then(function(response) {

		// 	console.log(response);

		// 	console.log(response.data.artist.name);
		// 	console.log(response.data.artist.image[4]["#text"]);

		  // $scope.artistName = response.data.artist.name;

		// 	$scope.home = false;
		// 	$scope.results = true;

		// }, function(reason) {
		// 	alert("Failed: " + reason);
		// });


		// var makeAlbumInquiry = findmusic.getAlbums(artist);
		// makeAlbumInquiry.then(function(response) {

		// 	console.log(response);

		// 	$scope.allAlbums = response.data.topalbums.album;

		// }, function(reason) {
		// 	alert("Failed: " + reason);
		// });



		// GET MUSICIAN BIO, ALBUMS, AND DISCOGRAPHY FROM ROVI API (CONTAINS VIDEO API SEARCH)
		var signature = genSig();

		var makeInfoInquiry = findmusic.getOtherInfo(artist, signature);

		makeInfoInquiry.then(function(response) {

			$scope.home = false;
			$scope.results = true;

			$scope.artistName = response.data.searchResponse.results[0].name.name;

			console.log(response.data.searchResponse.results[0].name.musicBio);

			// Get artist biography
			var musicBio;

			if (response.data.searchResponse.results[0].name.musicBio === null) {
				$scope.searchErrorMessage = "Could not find your artist. Please search again!";
				$scope.returnHome();
				return;
			} else if (response.data.searchResponse.results[0].name.musicBio.musicBioOverview === null) {
				musicBio = response.data.searchResponse.results[0].name.musicBio.text;
			}	else if (response.data.searchResponse.results[0].name.musicBio.musicBioOverview[0].language === "English") {
				musicBio = response.data.searchResponse.results[0].name.musicBio.musicBioOverview[0].overview;
				console.log("English");
			} else {
				musicBio = response.data.searchResponse.results[0].name.musicBio.musicBioOverview[1].overview;
				console.log("Spanish");
			}

			musicBio = musicBio.replace(/\[[^\]]*]/g, '');

			var removeEnd = musicBio.indexOf(" ~ ");

			musicBio = musicBio.slice(0, removeEnd);

			if (musicBio.charAt(0) === '"') {
				musicBio = musicBio.slice(1);
			}

			if (musicBio.charAt(musicBio.length-1) !== '.') {
				musicBio = musicBio + ".";
			}

			$scope.artistBio = musicBio;


			// Get artist photo
			if (response.data.searchResponse.results[0].name.images === null) {
				var makeInquiry = findmusic.getMusician(artist);
				makeInquiry.then(function(response) {

					$scope.artistPhoto = response.data.artist.image[4]["#text"];

				}, function(reason) {
					alert("Failed: " + reason);
				});

			} else {
				$scope.artistPhoto = response.data.searchResponse.results[0].name.images[0].url;
				console.log("Photo");
			}


			// Get artist albums
			var albumList = response.data.searchResponse.results[0].name.discography;
			$scope.filteredAlbums = [];

			for (var i = 0; i < albumList.length; i++) {

				if (albumList[i].flags !== null) {
					var counter = 0;
					albumList[i].flags.forEach(function(flag) {
						if (flag === "Compilation" || flag === "Interview" || flag === "Live Recording" || flag === "Video" || flag === "Bootleg" || flag === "Studio & Live" || albumList[i].year === null) {
							counter++;
						}
					});

					if (counter === 0 && albumList[i].type === "Album") {
						$scope.filteredAlbums.push(albumList[i]);
						// This commented chunk would get album art, IF Rovi had it...which, apparently, they're not that great at.

						// console.log("INSIDEREQUEST");
						// var getAlbumArt = findmusic.getAlbumArt(albumList[i].ids.albumId, signature);
						// getAlbumArt.then(function(response) {
						// 	console.log("ALBUMARTRETURN", response);
						// 	$scope.filteredAlbums.push(albumList[i]);
						// });
					}
				} else {
					if (albumList[i].type === "Album" && albumList[i].year !== null) {
						$scope.filteredAlbums.push(albumList[i]);
					}
				}
			}


			// GET MUSICIAN VIDEOS FROM YOUTUBE
			var makeVideoInquiry = findmusic.getVideos($scope.artistName);
			makeVideoInquiry.then(function(response) {
				console.log(response);
				$scope.allVideos = response.data.items;
				console.log(response.data.items);

				if (response.data.items.length === 0) {
					$scope.videoResults = false;
					$scope.error = "Sorry...no videos for this artist!";
				}

				$scope.getIframeSrc = function (videoId) {
				  return 'https://www.youtube.com/embed/' + videoId;
				};

			}, function(reason) {
				$scope.videoResults = false;
				$scope.error = "Sorry ... no videos for this artist!";
			});

		}, function(reason) {
			alert("Failed: " + reason);
		});


	};


	/* Get the list of user's past artist searches */
	$scope.getPastArtists = function() {

		$scope.saveArtistButton = "";
		$scope.savedArtist = false;

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
	};


}]);
