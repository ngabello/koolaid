/**
 * Created by ngabelloa on 10/28/2016.
 */
'use strict';

function DeliveryService() {
    return ['$q', '$log', 'deliveryApiService',
        function($q, $log, deliveryApiService) {

            var timeoutInMilliseconds = 60000;

            this.getTimeout = function() {
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
            this.getSearchData = function(searchCriteria, sublineSearchType, effectiveOnly) {
                var params = { "search": searchCriteria, "SublineSearchType": sublineSearchType, "EffectiveOnly": effectiveOnly };
                return this.getData('markelriskclassification', params);
            };

            //GET http://localhost:59125/api/IsoTerritory?StateCode=VA
            this.getTerritory = function(stateCode) {
                var params = { "State": stateCode };
                return this.getData('IsoTerritory', params);
            };

            //http://localhost:59125/api/AmsService/Agencies/210/3
            this.getAmsData = function(searchCriteria, regionCode) {
                return this.getData(String.format('AmsService/Agencies/{0}/{1}', searchCriteria, regionCode), null);
            };

            //http://localhost:59125/api/AmsService/ProducerContacts/18318bd4-e2c2-dd11-a96e-005056b0310b
            this.getProducerContacts = function(agencyId) {
                return this.getData(String.format('AmsService/ProducerContacts/{0}', agencyId), null);
            };

            this.getData = function(apiMethod, params) {
                var urlCall;
                var newResDeferred = $q.defer();
                var deferred;

                if (params) {
                    urlCall = String.format('{0}/{1}?{2}', deliveryApiService.configuration.baseUrl, apiMethod, JSON.stringify(params));
                    deferred = deliveryApiService.one(apiMethod).withHttpConfig({ timeout: this.getTimeout() }).get(params);
                } else {
                    urlCall = String.format('{0}/{1}', deliveryApiService.configuration.baseUrl, apiMethod);
                    deferred = deliveryApiService.one(apiMethod).withHttpConfig({ timeout: this.getTimeout() }).get();
                }
                $q.when(deferred, function(result) {
                    if (!_.isObject(result.data)) {
                        newResDeferred.reject('DeliveryService: getData failed, response data is null');
                        $log.error(String.format('DeliveryService: getData - completed calling {0} , response data is null', urlCall), error);
                    } else {
                        newResDeferred.resolve(result.data.plain());
                    }
                }, function(error) {
                    newResDeferred.reject(error);
                    $log.error(String.format('DeliveryService: getData - failed calling {0}', urlCall), error);
                });
                return newResDeferred.promise;
            };


            this.postClassGuideData = function(request, apiMethod) {
                var urlCall;
                var newResDeferred = $q.defer();
                var deferred;

                urlCall = String.format('{0}/{1}', deliveryApiService.configuration.baseUrl, apiMethod);
                deliveryApiService.one(apiMethod).withHttpConfig({ timeout: this.getTimeout() }).post('', request).then(function(result) {
                    if (!_.isObject(result.data)) {
                        newResDeferred.reject('DeliveryService: getClassGuideData failed, response data is null');
                        $log.error(String.format('DeliveryService: getClassGuideData - completed calling {0} , response data is null', urlCall), error);
                    } else {
                        newResDeferred.resolve(result.data.plain());
                    }
                }, function(error) {
                    newResDeferred.reject(error);
                    $log.error(String.format('DeliveryService: getClassGuideData - failed calling {0}', urlCall), error);
                });
                return newResDeferred.promise;
            };
        }
    ];


}