var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

var Client = require('node-rest-client').Client;
var client = new Client();

client.registerMethod(
    "weeklydata", 
    "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", 
    "GET");

client.registerMethod(
    "dailydata", 
    "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", 
    "GET");

client.registerMethod(
    "hourlydata", 
    "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson", 
    "GET");

router.get('/quake_info/get/week', function(req, res, next) {
    var data = client.methods.weeklydata(function (data, response) {
          var respData = module.convertEarthDataToMarkers(data.features);
          res.json(respData);
      });
});

router.get('/quake_info/get/day', function(req, res, next) {
    var data = client.methods.dailydata(function (data, response) {
          var respData = module.convertEarthDataToMarkers(data.features);
          res.json(respData);
      });
});

router.get('/quake_info/get/hour', function(req, res, next) {
    var data = client.methods.hourlydata(function (data, response) {
          var respData = module.convertEarthDataToMarkers(data.features);
          res.json(respData);
      });
});

module.convertEarthDataToMarkers = function (data) {
    if(data) {
        var markersArr = [];
        for(var i = 0; i < data.length; i++) {
            var marker = {};
            
            // id, latitude, longitude, title, message, severity, duration, magnitude, eventTime
            marker.id = data[i].id;
            marker.latitude = data[i].geometry.coordinates[1];
            marker.longitude = data[i].geometry.coordinates[0];
            marker.title = data[i].properties.title;
            marker.message = data[i].properties.place;
            marker.severity = (data[i].properties.mag >= 5) ? 'alert' : 'info';
            marker.duration = data[i].properties.dmin;
            marker.magnitude = data[i].properties.mag;
            marker.eventTime = data[i].properties.time;
            
            markersArr.push(marker);
        }
        return markersArr;
    }else {
        return [];
    }
};

module.exports = router;