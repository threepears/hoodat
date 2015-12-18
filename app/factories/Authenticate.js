app.factory("Authenticate", 
	["$http", "$q", "$firebaseAuth", function($http, $q, $firebaseAuth) {


	/* Declare factory variables */
	var ref = new Firebase("https://hoodat.firebaseio.com");
	var uid;


	return {

		/* Return Firebase reference */
		getFirebase: function() {
			return $firebaseAuth(ref);
		},
		/* Return curent user ID */
		getUid: function(){
	      return uid;
	    },
	    /* Assign logged in user ID to a variable */
	    setUid: function(passedUid){
	      uid = passedUid;
	    }

	}


}]);