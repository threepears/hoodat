app.controller("LoginControl",
	["$scope", "$http", "$firebaseAuth", "Authenticate", "$firebaseArray", "$location", "$rootScope",
	 function($scope, $http, $firebaseAuth, Authenticate, $firebaseArray, $location, $rootScope) {

	 // $scope.username = "";


	$scope.loginUser = function() {
		$scope.authData = null;
	    $scope.error = null;

		console.log("Login!");
		
		Authenticate.getFirebase().$authWithPassword({
		  email    : $scope.user.email,
		  password : $scope.user.password
		}).then(function(userData) {
	        $scope.message = "User logged in with uid: " + userData.uid;
	        $rootScope.loggedIn = true;

	        Authenticate.setUid(userData.uid);

	        var userRef = new Firebase("https://hoodat.firebaseio.com/users/" + userData.uid);

	        console.log(userRef);

	        userRef.on("value", function(snapshot) {
	        	var name = snapshot.val();
	        	$rootScope.username = name.username;
	        	console.log(name.username);
		        $location.path('/main').replace();
		        $scope.$apply();
				
			}, function (errorObject) {
				console.log("The read failed: " + errorObject.code);
				$scope.loginError = errorObject;
			});


	        console.log("HELLO?", $scope.message);
	    }).catch(function(error) {
	        $scope.loginError = error;
	    });


	};

	

}]);