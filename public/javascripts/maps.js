angular.module('mapModule', ['uiGmapgoogle-maps', 'geolocation']);

angular.module('mapModule')
  .config(function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
          key: 'AIzaSyB-M1Rex82qJyysYDqqovByt3VcR7e60bk',
          libraries: 'geometry,visualization'
      });
  });

angular.module('mapModule')
  .controller('mapController', ['$scope', 'mapService', 'uiGmapGoogleMapApi', 'geolocation',
      function ($scope, mapService, uiGmapGoogleMapApi, geolocation) {

        $scope.map = {};
        $scope.isMapReady = false;
        $scope.defaultLocation = mapService.defaultLocation;
        $scope.currentLocation = mapService.defaultLocation;
        $scope.options = {scrollwheel: false};
        $scope.markers = [];

        uiGmapGoogleMapApi.then(function(maps) {
            $scope.map = maps;
            geolocation.getLocation().then( function ( data ) {
                var coords = {lat: data.coords.latitude, long: data.coords.longitude};
                var current = {};
                $scope.currentLocation.center.longitude = parseFloat(coords.long).toFixed(3);
                $scope.currentLocation.center.latitude = parseFloat(coords.lat).toFixed(3);
                $scope.isMapReady = true;
                $scope.markers.push(
                  mapService.addMarker(
                        $scope.markers.length,
                        $scope.currentLocation.center.latitude,
                        $scope.currentLocation.center.longitude,
                        'Current Location'
                  )
                );
            });
        });
      }]);

angular.module('mapModule')
  .factory('mapService', ['$rootScope', 'geolocation',
      function ($rootScope, geolocation) {

        var zoomLevel = 4;

        var mapService = {};
        mapService.defaultLocation = { center: { latitude: 45, longitude: -73 }, zoom: zoomLevel};

        var Point = function (id, latitude, longitude) {
            this.id = id;
            this.latitude = latitude;
            this.longitude = longitude;
            this.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
        };

        mapService.addMarker = function (id, latitude, longitude, title, message) {
            var point = new Point(
                id,
                latitude,
                longitude
            );

            point.title = '<strong>' + title + '</strong>';
            point.options = {};
            point.content = '<ul><li>latitude: ' + latitude + '</li>'
                                    + '<li>longitude: ' + longitude + '</li>'
                                    + '</ul>'

            point.options.draggable = false;
            return point;
        };

        return mapService;

      }]);
