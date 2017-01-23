/**
 * Created by ngabelloa on 10/28/2016.
 */
'use strict';

function setDefaultHeader(restangularConfigurer, headerDoc) {
  restangularConfigurer.setDefaultHeaders(
    {
      'SSO_USER_NAME': headerDoc.SSO_USER_NAME,
      'SSO_FIRSTNAME': headerDoc.SSO_FIRSTNAME,
      'SSO_LASTNAME': headerDoc.SSO_LASTNAME,
      'SSO_AGENCY_CODE': headerDoc.SSO_AGENCY_CODE,
      'SSO_AGENCY_NAME': headerDoc.SSO_AGENCY_NAME,
      'SSO_IS_INTERNAL': headerDoc.SSO_IS_INTERNAL,
      'SSO_IS_BROKERAGE': headerDoc.SSO_IS_BROKERAGE,
      'SSO_DEFAULT_STATE': headerDoc.SSO_DEFAULT_STATE,
      'X-UserName': headerDoc.XUserName
    });
}

angular.module('platform.apiServices', ['restangular', 'environment.config', 'quickQuotes.services'])
  .factory('deliveryApiService', ['Restangular', 'environmentConfig', 'HeaderDocumentService', function (Restangular, environmentConfig, headerDocService) {
    return Restangular.withConfig(function (restangularConfigurer) {
      restangularConfigurer.setFullResponse(true);
      restangularConfigurer.setBaseUrl(environmentConfig.deliveryApi);
      setDefaultHeader(restangularConfigurer, headerDocService.getHeaderDocument());
    });
  }])
  .factory('pdsApiService', ['Restangular', 'environmentConfig', 'HeaderDocumentService', function (Restangular, environmentConfig, headerDocService) {
    return Restangular.withConfig(function (restangularConfigurer) {
      restangularConfigurer.setFullResponse(true);
      restangularConfigurer.setBaseUrl(environmentConfig.pdsApi);
      setDefaultHeader(restangularConfigurer, headerDocService.getHeaderDocument());
    });
  }])
  .factory('decisionApiService', ['Restangular', 'environmentConfig', 'HeaderDocumentService', function (Restangular, environmentConfig, headerDocService) {
    return Restangular.withConfig(function (restangularConfigurer) {
      restangularConfigurer.setFullResponse(true);
      restangularConfigurer.setBaseUrl(environmentConfig.decisionApi);
      setDefaultHeader(restangularConfigurer, headerDocService.getHeaderDocument());
    });
  }])
  .service('deliveryService', DeliveryService())
  .service('decisionService', DecisionService())
  .service('lookupService', LookupService())
  .service('pdsService',PDSService())
;
