/**
 * Created by ngabelloa on 12/12/2016.
 */
'use strict';

function GLCoverageSelectionComponentCtrl() {
return ['spinnerService', '$state', '$stateParams', 'LookupDataService', 'deliveryService', 'ErrorService', 'PolicyModel', 'decisionService', 'Constants',
    '$timeout', 'ModalService', 'HeaderDocumentService', 'navigationService', '$controller',
    function (spinnerService, $state, params, lookupData, deliveryService, errorService, policyModel, decisionService, constants,
              $timeout, modalService, headerDocumentService, navigationService, $controller) {

      var coverageVM = this;

      coverageVM.getData = function () {
        coverageVM.getLookupData('PremiumBase', 'PremiumBaseList');
      };

      coverageVM.getEvents = function () {
        _.each(coverageVM.riskUnits, function (item) {
          item.riskUnit.showSublineRates = function () {
            var isCustomPremiumBase = _.find(this.Sublines, function (obj) {
              return obj.Eligibility == constants.Eligibility.Submit;
            }) ? true : false;
            return (this.ZipCode !== undefined && this.PremiumBase != this.PremiumBaseDefault) || isCustomPremiumBase;
          }
        });
      };
      
      var baseController = $controller('BaseCoverageSelectionController', {coverageVM: coverageVM});
    }
  ];
}
