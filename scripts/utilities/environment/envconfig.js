'use strict';

angular.module('environment.config', [])
  .constant('environmentConfig', {
    "decisionApi" : "http://localhost:47776/api",
    "pdsApi" : "http://localhost:16528/api",
    "deliveryApi": "http://localhost:59125/api",
    //"deliveryApi": "http://stapp720:42000/api",
    //"decisionApi" : "http://stapp720:47000/api",
    // "pdsApi" : "http://stapp720:52000/api",
    "environment": "ci",
    "loggingLevel": "debug",
    "idleDuration": 300,
    "warningDuration": 30
  })
  .constant('logLevel', {
    level: 'debug'
  })
;
