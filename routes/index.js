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
          //console.log('Weekly Data:', data);
          res.json(data);
      });
});

router.get('/quake_info/get/day', function(req, res, next) {
    var data = client.methods.dailydata(function (data, response) {
          //console.log('Daily Data:', data);
          res.json(data);
      });
});

router.get('/quake_info/get/hour', function(req, res, next) {
    var data = client.methods.hourlydata(function (data, response) {
          //console.log('Hourly Data:', data.features);
          res.json(data.features);
      });
});

module.exports = router;