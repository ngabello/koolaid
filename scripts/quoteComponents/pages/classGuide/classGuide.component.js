/**
 * Created by ngabelloa on 11/8/2016.
 */
'use strict';

function ClassGuideComponentCtrl() {

  function MapTerritoryData(dataItem) {
    return (
    {
      Description: dataItem.Code + ' - ' + dataItem.ShortDescription,
      Code: dataItem.Code,
      StateId: dataItem.StateId,
      SublineCode: dataItem.SublineCode,
      SubLineId: dataItem.SublineId
    });
  }

  return ['$log', '$state', '$stateParams', '$location', 'spinnerService', 'LookupDataService', 'deliveryService', 'QuickQuoteDataModelService',
    function (logger, $state, $stateParams, $location, spinnerService, lookupData, deliveryService, quickQuoteDataModelService) {

      if (!lookupData.hasLookups()) {
        $location.path('/');
        return;
      }

      this.locationChange = {
        isopen: false,
        chkState: false,
        chkZip: false,
        zipCode: null,
        territory: null,
        state: null,
        territories:null
      };

      this.stateList = lookupData.getStates();

      var self = this;


      var getClassGuideData = function(apiMethod, srchRequest){
         spinnerService.show('processingSpinner');
           
         deliveryService.postClassGuideData(srchRequest, apiMethod).then(function(result){
           self.responseData = result;
            spinnerService.hide('processingSpinner');
         })
      };

      var getSrchResults = function(sublineId){
        self.srchResults = quickQuoteDataModelService.getLiabilityClassGuideRequest();
        self.locationChange.state = self.srchResults.StateCode;
        if (self.srchResults && self.srchResults.Subline == sublineId) {
          switch (sublineId) {
            case EnumSublineType.GeneralLiability:
              getClassGuideData('LiabilityClassGuide', self.srchResults);            
              break;
          }
        }
      };

      if ($stateParams.sublineId) {
        getSrchResults($stateParams.sublineId);
      }

      this.srchResultsChanged = function (sublineId) {
        getSrchResults(sublineId);
      };

      this.closeLocation = function(){
        self.locationChange.isopen = false;
        self.locationChange.chkState = false;
        self.locationChange.chkZip = false;
      };

      this.updateLocation = function(){
        self.locationChange.isopen = false;
      };

      this.locationSelected = function(){
          deliveryService.getTerritory(self.locationChange.state).then(function(result){
            self.locationChange.territories = result.Collection.map(function (item) {
              return MapTerritoryData(item);
            });
          }, function (error) {
            //errorService.showSystemError('ClassGuideComponentCtrl: Failed to retrieve territories with error', error);
          });
      };

    }
  ];
}
