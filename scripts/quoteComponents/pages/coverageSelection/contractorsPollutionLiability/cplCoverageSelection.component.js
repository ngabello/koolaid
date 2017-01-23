/**
 * Created by ngabelloa on 11/17/2016.
 */
'use strict';

function CPLCoverageSelectionComponentCtrl() {

  return ['spinnerService', '$state', '$stateParams', 'LookupDataService', 'deliveryService', 'ErrorService', 'PolicyModel', 'decisionService', 'Constants',
    '$timeout', 'ModalService', 'HeaderDocumentService', 'navigationService',
    function (spinnerService, $state, params, lookupData, deliveryService, errorService, policyModel, decisionService, constants,
              $timeout, modalService, headerDocumentService, navigationService) {

      spinnerService.hideAll();
      if (!lookupData.hasLookups() || !params.transactionId) {
        navigationService.goToAppStart();
        return;
      }

      var cplCoverageSelectionVM = this;
      cplCoverageSelectionVM.formSubmitted = false;
      cplCoverageSelectionVM.policy = policyModel.getPolicy();
      cplCoverageSelectionVM.transactionId = params.transactionId;
      cplCoverageSelectionVM.lobId = params.lobId;
      cplCoverageSelectionVM.isInternalUser = headerDocumentService.getHeaderIsInternal();

      cplCoverageSelectionVM.continue = function (form) {
        cplCoverageSelectionVM.formSubmitted = true;
        if (form.$valid) {
          spinnerService.show('processingSpinner');
          navigationService.getNextStep({transactionId: cplCoverageSelectionVM.transactionId, lobId: cplCoverageSelectionVM.lobId});
        }
      };

      cplCoverageSelectionVM.navigateBack = function (form) {
        cplCoverageSelectionVM.formSubmitted = true;
        if (form.$valid) {

        }
      };

      cplCoverageSelectionVM.savePolicy = function (form) {
        cplCoverageSelectionVM.formSubmitted = true;
        if (form.$valid) {

        }
      }



    }
  ];
}
