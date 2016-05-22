angular.module('geoLocateModule', ['mapModule']);

angular.module('geoLocateModule')
  .controller('geoLocateCtrl', ['$scope', 'geolocation',
      function ($scope, geolocation) {

        $scope.current = {};

        geolocation.getLocation()
            .then( function ( data ) {
                  var coords = {lat: data.coords.latitude, long: data.coords.longitude};
                  // Set the latitude and longitude equal to the HTML5 coordinates
                  $scope.current.longitude = parseFloat(coords.long).toFixed(3);
                  $scope.current.latitude = parseFloat(coords.lat).toFixed(3);
                }
            );
      }]
  );
