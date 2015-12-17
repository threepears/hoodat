app.factory("Authenticate", 
	["$http", "$q", "$firebaseAuth", function($http, $q, $firebaseAuth) {

	var ref = new Firebase("https://hoodat.firebaseio.com");
	var uid;


	return {

		getFirebase: function() {
			return $firebaseAuth(ref);
		},
		getUid: function(){
	      return uid;
	    },
	    setUid: function(passedUid){
	      uid = passedUid;
	    }





	}

}]);