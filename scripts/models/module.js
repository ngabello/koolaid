/**
 * Created by ngabelloa on 10/31/2016.
 */
angular.module('quickQuote.models', [])
  .factory('PolicyReferralRequestModel', PolicyReferralRequestService())
  .factory('PolicySearchRequestModel', PolicySearchRequestService())
  .factory('ModelHelper', ModelHelperService())
  .service('PolicyModel', PolicyModelService())
  .factory('AccountInfoModel', AccountInfoModelService())
  .service('DecisionModel', DecisionModelService())
  .factory('DashboardModel', DashboardModelService())
;
