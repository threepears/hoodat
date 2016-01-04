app.controller("LoginControl",
	["$scope", "$http", "$firebaseAuth", "Authenticate", "$firebaseArray", "$location", "$rootScope", "$sce",
	 function($scope, $http, $firebaseAuth, Authenticate, $firebaseArray, $location, $rootScope, $sce) {


	$scope.loginKey = function(keyEvent) {
		console.log("Login People");
        if (keyEvent.which === 13) {
        	$scope.loginUser();
    	}
    };


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
	        	$scope.$apply(function() {
		        	var name = snapshot.val();
		        	$rootScope.username = name.username;
		        	console.log(name.username);
		        	$scope.$parent.homeMessage = "You are now logged in!";
	        		$location.path('/main').replace();
	        	});

/*		        $scope.$apply();*/
				
			}, function (errorObject) {
				console.log("The read failed: " + errorObject.code);
				$scope.loginError = errorObject;
			});


	        console.log("HELLO?", $scope.message);
	    }).catch(function(error) {
	        $scope.loginError = error.message;
	        console.log(error);
	    });


	};

	

}]);