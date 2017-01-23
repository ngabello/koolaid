/**
 * Created by ngabelloa on 11/3/2016.
 */
'use strict';
function LookupService() {

  return ['$q', '$log', 'pdsApiService', 'LookupDataService',
    function ($q, $log, pdsApiService, lookupDataService) {

      var timeoutInMilliseconds = 60000;

      this.getTimeout = function () {
        return timeoutInMilliseconds;
      };

      this.getLookupData = function () {
        var newResDeferred = $q.defer();
        if (lookupDataService.hasLookups()) {
          newResDeferred.resolve();
          return newResDeferred.promise;
        }
        var urlCall = String.format('{0}/{1}', pdsApiService.configuration.baseUrl, 'lookupData');
        pdsApiService.one('lookupData').withHttpConfig({timeout: this.getTimeout()}).get().then(function (result) {
            if (!_.isObject(result.data)) {
              newResDeferred.reject('LookupService: Calling lookups failed, response data is null');
              $log.error(String.format('LookupService: getLookups - completed calling {0} , response data is null', urlCall), error);
            } else {
              lookupDataService.saveLookupData(result.data.data);
              newResDeferred.resolve();
            }
          }, function (error) {
            newResDeferred.reject(error);
            $log.error(String.format('LookupService: getLookups - failed calling {0}', urlCall), error);
          }
        );
        return newResDeferred.promise;
      };
    }];
}
