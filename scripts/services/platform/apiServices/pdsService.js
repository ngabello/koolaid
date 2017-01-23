/**
 * Created by vbenjamina on 1/6/2017.
 */
'use strict';
function PDSService() {
  return ['$q', '$log', 'pdsApiService', 'deliveryApiService',
    function ($q, $log, pdsApiService, deliveryApiService) {

      var timeoutInMilliseconds = 60000;

      this.getTimeout = function () {
        return timeoutInMilliseconds;
      };

      //Synopsis
      /*
       http://localhost:59125/api/markelriskclassification?search=&SublineSearchType=InlandMarine&EffectiveOnly=true
       http://localhost:59125/api/markelriskclassification?search=apa&SublineSearchType=GeneralLiability&EffectiveOnly=true
       http://localhost:59125/api/markelriskclassification?search=&SublineSearchType=Liquor&EffectiveOnly=true
       http://localhost:59125/api/IsoTerritory?StateCode=VA
       */

      //Get -- http://localhost:59125/api/markelriskclassification?search=60010&SublineSearchType=GeneralLiability&EffectiveOnly=true
      this.getSearchData = function(searchCriteria, sublineSearchType, effectiveOnly){
        var params = {"search": searchCriteria, "SublineSearchType": sublineSearchType, "EffectiveOnly": effectiveOnly};
        return this.getData('markelriskclassification', params);
      };

      //GET http://localhost:59125/api/IsoTerritory?StateCode=VA
      this.getTerritory = function(stateCode){
        var params = {"State": stateCode };
        return this.getData('IsoTerritory', params);
      };  

      //http://localhost:59125/api/AmsService/Agencies/210/3
      this.getAmsData = function(searchCriteria, regionCode){
        return this.getData(String.format('AmsService/Agencies/{0}/{1}', searchCriteria, regionCode), null);
      };

      //http://localhost:59125/api/AmsService/ProducerContacts/18318bd4-e2c2-dd11-a96e-005056b0310b
      this.getProducerContacts = function(agencyId){
        return this.getData(String.format('AmsService/ProducerContacts/{0}', agencyId), null);
      };

      this.getData = function (apiMethod, params) {
        var urlCall;
        var newResDeferred = $q.defer();
        var deferred;

        if(params){
          urlCall = String.format('{0}/{1}?{2}', pdsApiService.configuration.baseUrl, apiMethod, JSON.stringify(params));
          deferred = pdsApiService.one(apiMethod).withHttpConfig({timeout: this.getTimeout()}).get(params);
        }else{
          urlCall = String.format('{0}/{1}', pdsApiService.configuration.baseUrl, apiMethod);
          deferred = pdsApiService.one(apiMethod).withHttpConfig({timeout: this.getTimeout()}).get();
        }
        $q.when(deferred, function (result) {
          if (!_.isObject(result.data)) {
            newResDeferred.reject('PDSService: getData failed, response data is null');
            $log.error(String.format('PDSService: getData - completed calling {0} , response data is null', urlCall), error);
          } else {
              newResDeferred.resolve(result.data.plain());
          }
        }, function (error) {
          newResDeferred.reject(error);
          $log.error(String.format('PDSService: getData - failed calling {0}', urlCall), error);
        });
        return newResDeferred.promise;
      };
    }];
}
