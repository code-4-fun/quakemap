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
                $scope.currentLocation.center.longitude = parseFloat(coords.long).toFixed(3);
                $scope.currentLocation.center.latitude = parseFloat(coords.lat).toFixed(3);
                $scope.isMapReady = true;
                $scope.markers.push(
                    mapService.addMarker(
                          0, $scope.currentLocation.center.latitude, $scope.currentLocation.center.longitude,
                          'Current Location', '', mapService.AlertTypes.INFO
                    )
                    /* mapService.addMarker(
                        'us20005yci', '36.4518', '-98.7445',
                        'M 2.7 - 31km NW of Fairview, Oklahoma',
                        '31km NW of Fairview, Oklahoma',
                        mapService.AlertTypes.ALERT, 0.018, 2.7, new Date(1464312395600)
                    )*/
                );
            });
        });
      }]);

angular.module('mapModule')
  .factory('mapService', [
      function () {

        var zoomLevel = 2;

        var mapService = {};
        mapService.defaultLocation = { center: { latitude: 45, longitude: -73 }, zoom: zoomLevel};
        
        mapService.AlertTypes = {
               ALARM: 0,
               ALERT: 1,
               INFO: 2
        };

        var Point = function (id, latitude, longitude,
                              title, message, severity, 
                              duration, magnitude, eventTime
                             ) {
            var scope = this;
            scope.id = id;
            scope.latitude = parseFloat(latitude).toFixed(3);
            scope.longitude = parseFloat(longitude).toFixed(3);
            scope.title = '<strong>' + title + '</strong>';
            scope.message = message;
            scope.severity = severity;
            scope.magnitude = magnitude;
            scope.duration = duration;
            scope.eventTime = eventTime;
            
            scope.options = {};
            scope.options.draggable = false;
            
            scope.content = '';
            scope.content = '<ul><li>Location:<ul><li>latitude: ' + scope.latitude + '</li><li>longitude: ' + scope.longitude + '</li></ul>';
                          
            if(severity === mapService.AlertTypes.INFO) {
                scope.icon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
            }else {
                scope.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
                scope.content = scope.content 
                          + '<li>Details: ' + ((scope.message)? scope.message : '') + '</li>'
                          + '<li>Severity: ' + scope.severity + '</li>'
                          + '<li>Magnitude: ' + scope.magnitude + '</li>'
                          + '<li>Duration: ' + scope.duration + '</li>'
                          + '<li>Event Time: ' + scope.eventTime + '</li>';
            }
            scope.content = scope.content + '</ul>';
        };

        mapService.addMarker = function (id, latitude, longitude, 
                                         title, message, severity, 
                                         duration, magnitude, eventTime
                                        ) {
            var point = new Point(
                id, latitude, longitude,
                title, message, severity,
                duration, magnitude, eventTime
            );
            
            return point;
        };

        return mapService;

      }]);
