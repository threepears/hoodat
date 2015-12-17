app.controller("MainControl",
	["$scope", "$firebaseAuth", "Authenticate", "$firebaseArray", "$location", "$rootScope", "FindMusic", "Keys",
	 function($scope, $firebaseAuth, Authenticate, $firebaseArray, $location, $rootScope, findmusic, keys) {


	/* Declare scope variables */
	$scope.$parent.saveArtistButton = "Save This Artist";
	$scope.$parent.savedArtist = false;

	console.log("scope", $scope);


    /* Add searched artist to user's account */
	$scope.saveArtist = function() {
		var selectedArtist = $scope.artistName;
		console.log(selectedArtist);

		var userUid = Authenticate.getUid();
		console.log(userUid);

		var userRef = new Firebase("https://hoodat.firebaseio.com/users/" + userUid + "/artists");

		userRef.push(selectedArtist);

		$scope.$parent.saveArtistButton = "Artist Saved!"
		$scope.$parent.savedArtist = true;
	};



}]);