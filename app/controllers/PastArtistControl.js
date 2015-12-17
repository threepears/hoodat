app.controller("PastArtistControl",
	["$scope", "$firebaseAuth", "Authenticate", "$firebaseArray", "$location", "$rootScope", "MasterControl", "Keys",
	 function($scope, $firebaseAuth, Authenticate, $firebaseArray, $location, $rootScope, master, keys) {


	/* Declare scope variables */
	$scope.searchData = "";


    /* Research old artist search */
	$scope.pastArtistSearch = function(artist) {
		$scope.searchData = artist;
		console.log(artist);

		master.search();

		$location.path('/main').replace();
	};


}]);