app.factory("FindMusic",
	["$http", "$q", "Keys", function($http, $q, keys) {


  var lastfm = keys.getLastFM();
  var youtube = keys.getYouTube();
  var rovi = keys.getRovi();


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
          url: "http://ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&limit=20&artist=" + artist + "&api_key=" + lastfm + "&format=json"
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

    getSpotifyAlbums: function(artistID){
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: "https://api.spotify.com/v1/artists/" + artistID + "/albums"
        }).then(function (response) {
          console.log(response);
    /*      var artistID = response.data.artists.items[0].id;
          console.log(artistID);*/
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
          url: "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + artist + "+VEVO|" + artist + "&type=video&order=viewCount&videoCategoryId=10&maxResults=3&key=" + youtube
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
          url: "http://cors-request-server.herokuapp.com/api/" + artist + "/" + signature
          // url: "http://api.rovicorp.com/search/v2.1/music/search?apikey=" + rovi + "&sig=" + signature + "&query=" + artist + "&entitytype=artist&size=1"
        }).then(function (response) {
          console.log(response);
          resolve(response);
        }, function (error) {
          reject(error);
        });
      });
    },

    getAlbumArt: function(albumId, signature){
      console.log("INSIDEGETALBUMARTFUNCTION", albumId);
      return $q(function(resolve,reject) {
        $http({
          method: 'GET',
          url: "http://cors-request-server.herokuapp.com/album/" + albumId + "/" + signature
          // url: "http://api.rovicorp.com/data/v1.1/album/images?apikey=" + rovi + "&sig=" + signature + "&albumid=" + albumId + "&imagesize=200-300x200-300"
        }).then(function (response) {
          console.log("ALBUMART", response.data.album.images);
          resolve(response);
        }, function (error) {
          reject(error);
        });
      });
    },

    getEchonestVideos: function(artist) {
      return $q(function(resolve,reject) {
        $http({
          method: 'GET',
          url: "http://cors-request-server.herokuapp.com/videos/" + artist
        }).then(function (response) {
          console.log(response);
          resolve(response);
        }, function (error) {
          reject(error);
          console.log(error);
        });
      });
    }

  }

}]);
