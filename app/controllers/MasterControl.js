app.controller("MasterControl", ["$scope", "$rootScope", "$location", "$firebaseArray", "FindMusic", "Keys", "$anchorScroll", "Authenticate", function($scope, $rootScope, $location, $firebaseArray, findmusic, keys, $anchorScroll, Authenticate) {


	/* Assign Master Control variables */
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
	var rovi = keys.getRovi();
	var roviSecret = keys.getRoviSecret();


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

			
/*			console.log(response.data.artist.name);
			console.log(response.data.artist.image[4]["#text"]);

		    $scope.artistName = response.data.artist.name;
			$scope.artistPhoto = response.data.artist.image[4]["#text"];*/

	/*		$(".photo > img").attr("src", artistphoto);
			$(".photo > img").attr("alt", artistname);*/
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


		var signature = genSig();
      	console.log(signature);

		var makeInfoInquiry = findmusic.getOtherInfo(artist, signature);
		makeInfoInquiry.then(function(response) {

			console.log(response);

	
		}, function(reason) {
			alert("Failed: " + reason);
		});

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
	    /*$location.path('/main').replace();*/
	};



}]);