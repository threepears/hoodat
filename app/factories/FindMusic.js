app.factory("FindMusic", 
	["$http", "$q", "Keys", function($http, $q, keys) {


  var lastfm = keys.getLastFM();
  console.log(lastfm);
  var youtube = keys.getYouTube();
  console.log(youtube);
  var rovi = keys.getRovi();
  console.log(rovi);


	return {

    getMusician: function(artist){
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=" + lastfm + "&format=json"
        }).then(function (response) {
          console.log(response);
          resolve(response);
        }, function (error) {
          reject(error);
        });
      });
    },

    getAlbums: function(artist){
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: "http://ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=" + artist + "&api_key=" + lastfm + "&format=json"
        }).then(function (response) {
          console.log(response);
          resolve(response);
        }, function (error) {
          reject(error);
        });
      });
    },

    getSpotifyArtist: function(artist){
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: "https://api.spotify.com/v1/search?q=" + artist + "&type=artist"
        }).then(function (response) {
          console.log(response);
          var artistID = response.data.artists.items[0].id;
          resolve(artistID);
        }, function (error) {
          reject(error);
        });
      });
    },

    getSpotifyAlbums: function(artist){
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: "https://api.spotify.com/v1/search?q=" + artist + "&type=artist"
        }).then(function (response) {
          console.log(response);
          var artistID = response.data.artists.items[0].id;
          console.log(artistID);
          resolve(response);
        }, function (error) {
          reject(error);
        });
      });
    },

    getVideos: function(artist){
      return $q(function(resolve,reject) {
        $http({
          method: 'GET',
          url: "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + artist + "&type=video&videoCaption=closedCaption&videoCategoryId=10&maxResults=3&key=" + youtube
        }).then(function (response) {
          console.log(response);
          resolve(response);
        }, function (error) {
          reject(error);
          console.log(error);
        });
      });
    },

    getOtherInfo: function(artist, signature){
      return $q(function(resolve,reject) {
        $http({
          method: 'GET',
          url: "http://api.rovicorp.com/search/v2.1/music/search?apikey=" + rovi + "&sig=" + signature + "&query=" + artist + "&entitytype=artist&size=1"
        }).then(function (response) {
          console.log(response);
          resolve(response);
        }, function (error) {
          reject(error);
        });
      });
    }
    
  }

}]);