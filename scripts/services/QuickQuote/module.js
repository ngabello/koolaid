/**
 * Created by ngabelloa on 11/4/2016.
 */
angular.module('quickQuotes.services', ['quickQuote.models'])
  .factory('SearchTransactionService', SearchTransactionService())
  .service('HeaderDocumentService', HeaderDocumentService())
  .service('QuickQuoteDataModelService', QuickQuoteDataModelService())
  .factory('routeStateService', RouteStateService())
;
