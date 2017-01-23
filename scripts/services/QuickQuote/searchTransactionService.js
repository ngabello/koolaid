/**
 * Created by ngabelloa on 11/4/2016.
 */
function SearchTransactionService() {
  'use strict';


  return function () {
    return {

      //Updates the fields for searchRequest
      updateSearchRequest: function (searchCriteria, referralRequest) {
        //This is required because there 4 fields for SearchDate
        referralRequest.LimitScope = searchCriteria.LimitScope;
        referralRequest.SearchValue = searchCriteria.SearchValue;
        referralRequest.SearchType = searchCriteria.SearchType;
        referralRequest.SearchStatus = searchCriteria.SearchStatus;
        switch (searchCriteria.SearchType) {
          case '8' : // ExpirationDate
            referralRequest.SearchFromExpiration = searchCriteria.SearchFrom;
            referralRequest.SearchToExpiration = searchCriteria.SearchTo;
            referralRequest.SearchFrom = null;
            referralRequest.SearchTo = null;
            break;
          case '4' : // CreatedDate
          case '5' : // EffectiveDate
            referralRequest.SearchFromExpiration = null;
            referralRequest.SearchToExpiration = null;
            referralRequest.SearchFrom = searchCriteria.SearchFrom;
            referralRequest.SearchTo = searchCriteria.SearchTo;
            break;
        }
      },

      getInitialSearch: function () {
        var searchCriteria = {
          SearchType: null,
          SearchFrom: moment().subtract(1, 'month').toDate(),
          SearchTo: new Date(),
          SearchValue: null,
          LimitScope: null,
          LimitSearchFrom: null
        };
        return searchCriteria;
      },

      updateSearchCriteria: function (searchCriteria) {
        switch (searchCriteria.SearchType) {
          case '8' : // ExpirationDate
            searchCriteria.SearchFrom = new Date();
            searchCriteria.SearchTo = moment().add(3, 'month').toDate();
            break;
        }
      }
    }
  };
}
