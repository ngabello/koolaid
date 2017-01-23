/**
 * Created by ngabelloa on 11/8/2016.
 */
'use strict';

var liabilityClassGuideRequest = {
  ClassCode: null,
  EffectiveDate: null,
  MarkelRiskClassificationId: null,
  StateCode: null,
  Subline: null,
  Description: null,
  SubCode: null
};

function QuickQuoteDataModelService() {
  return [function () {

    this.getLiabilityClassGuideRequest = function () {
      return angular.copy(liabilityClassGuideRequest);
    };

    this.saveLiabilityClassGuideRequest = function(srchResults){
      liabilityClassGuideRequest = srchResults;
    }

  }];
}
