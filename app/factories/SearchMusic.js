app.factory("SearchMusic", 
	["$http", "$q", "$location", "FindMusic", function($http, $q, $location, findmusic) {


	/* Declare scope variables */
	$scope.home = true;
	$scope.results = false;
	$scope.searchData = "";
	$scope.artistName = "";
	$scope.artistPhoto = "";
	$scope.artistBio = "";


	return {

		/* Perform artist searches: bio, discography, and videos */
		search: function() {
			$location.path('/main').replace();

			var artist = $scope.searchData;
			console.log(artist);

			var makeInquiry = findmusic.getMusician(artist);
			makeInquiry.then(function(response) {

				console.log(response);
				console.log(response.data.artist.bio.summary);
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

				
			/*	console.log(response.data.artist.name);
				console.log(response.data.artist.image[4]["#text"]);

			    $scope.artistName = response.data.artist.name;
				$scope.artistPhoto = response.data.artist.image[4]["#text"];*/

			/*	$(".photo > img").attr("src", artistphoto);
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
				alert("Failed: " + reason);
			});


			var signature = genSig();
	      	console.log(signature);

			var makeInfoInquiry = findmusic.getOtherInfo(artist, signature);
			makeInfoInquiry.then(function(response) {

				console.log(response);

		
			}, function(reason) {
				alert("Failed: " + reason);
			});

		}

  	}

}]);