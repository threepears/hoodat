app.controller("PastArtistControl",
	["$scope", "$firebaseAuth", "Authenticate", "$firebaseArray", "$location", "$rootScope", "Keys",
	 function($scope, $firebaseAuth, Authenticate, $firebaseArray, $location, $rootScope, keys) {


	/* Declare scope variables */
	$scope.searchData = "";


    /* Research old artist search */
	$scope.pastArtistSearch = function(artist) {
		$scope.$parent.searchData = artist;
		console.log(artist);

		$scope.$parent.search();

		$location.path('/main').replace();
	};


}]);