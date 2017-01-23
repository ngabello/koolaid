/**
 * Created by ngabelloa on 10/28/2016.
 */
angular.module('platform.logging', [])
  .config(['$provide', function ($provide) {
    $provide.decorator('$log', ['$delegate', 'loggingService', function ($delegate, loggingService) {
      $delegate.log = function (logItem) {
        loggingService.log(logItem);
      };
      $delegate.debug = function (msg) {
        loggingService.logDebug(msg);
      };
      $delegate.info = function (msg) {
        loggingService.logInfo(msg);
      };
      $delegate.warn = function (msg) {
        loggingService.logWarn(msg);
      };
      $delegate.error = function (msg, exception) {
        loggingService.logError(msg, exception);
      };

      return $delegate;
    }]);
  }])
  .provider('$exceptionHandler',
    {
      $get: ['loggingService', function (loggingService) {
        return (loggingService.logError);
      }]
    })
  .factory('loggingService', LoggingEventService());
