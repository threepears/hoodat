var app = angular.module("HoodatApp", ["ngRoute", "firebase", "angular.filter"]).config(function($sceDelegateProvider) {
      $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**',
        'http://www.dailymotion.com/embed/video/**']);
});



app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'app/partials/main.html',
        controller: 'MainControl'
      })
      .when('/login', {
        templateUrl: 'app/partials/login.html',
        controller: 'LoginControl'
      })
      .when('/register', {
        templateUrl: 'app/partials/register.html',
        controller: 'RegisterControl'
      })
      .when('/pastsearches', {
        templateUrl: 'app/partials/pastsearches.html',
        controller: 'PastArtistControl'
      })
      .otherwise('/main');
  }]);
