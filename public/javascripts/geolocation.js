angular.module('geoLocateModule', ['mapModule']);

angular.module('geoLocateModule')
  .controller('geoLocateCtrl', ['$scope', 'geolocation', 'mapService',
      function ($scope, geolocation, mapService) {

        $scope.current = {};

        geolocation.getLocation()
            .then( function ( data ) {
                  var coords = {lat: data.coords.latitude, long: data.coords.longitude};
                  // Set the latitude and longitude equal to the HTML5 coordinates
                  $scope.current.longitude = parseFloat(coords.long).toFixed(3);
                  $scope.current.latitude = parseFloat(coords.lat).toFixed(3);
                }
            );
          
        $scope.duration = 0;
        $scope.modes = getDurationModes();
          
        function getDurationModes() {
            var modes = [];
            for(var mode in mapService.DurationModes) {
                modes.push(mode);
            }
            return modes;
        };
          
      }]
  );
