app.controller("RegisterControl",
	["$scope", "$http", "$firebaseAuth", "Authenticate", "$firebaseArray", "$location", "$rootScope", "$sce",
	 function($scope, $http, $firebaseAuth, Authenticate, $firebaseArray, $location, $rootScope, $sce) {


	/* Declare Controller variables */
	var newText = "THANKS FOR REGISTERING!<br/><br/>NOW LOGIN...";
	$scope.user = {};
	$scope.registerError = "";


	/* Register a new user */
	$scope.registerUser = function() {
/*		$scope.message = null;
		$scope.error = null;*/
		Authenticate.getFirebase().$createUser({
		  email    : $scope.user.email,
		  username : $scope.user.username,
		  password : $scope.user.password
		}).then(function(userData) {
		  console.log("Successfully created user account with uid:", userData.uid);
		  Authenticate.setUid(userData.uid);

		  var addRef = new Firebase("https://hoodat.firebaseio.com/users/" + userData.uid);
		  console.log(addRef);
		  addRef.set({username: $scope.user.username});

		  var fun = Authenticate.getUid();
		  console.log(fun);

		  $scope.$parent.loginMessage = $sce.trustAsHtml(newText);

          $location.path('/login').replace();
		  
		}).catch(function(error) {
			console.log(error);
			$scope.registerError = error.message;
		});
	};


}]);