/**
 * Created by ngabelloa on 11/17/2016.
 */
'use strict';

function CPLRatesPremiumComponentCtrl() {

  return ['spinnerService', '$state', '$stateParams', 'LookupDataService', 'deliveryService', 'ErrorService', 'PolicyModel', 'decisionService', 'Constants',
    '$timeout', 'ModalService', 'HeaderDocumentService', 'navigationService',
    function (spinnerService, $state, params, lookupData, deliveryService, errorService, policyModel, decisionService, constants,
              $timeout, modalService, headerDocumentService, navigationService) {

      spinnerService.hideAll();
      if (!lookupData.hasLookups() || !params.transactionId) {
        navigationService.goToAppStart();
        return;
      }

      var ratePremiumVM = this;
      ratePremiumVM.formSubmitted = false;
      ratePremiumVM.policy = policyModel.getPolicy();
      ratePremiumVM.transactionId = params.transactionId;
      ratePremiumVM.lob = $state.current.data.lob;
      ratePremiumVM.isInternalUser = headerDocumentService.getHeaderIsInternal();

      ratePremiumVM.continue = function (form) {
        ratePremiumVM.formSubmitted = true;
        if (form.$valid) {
          spinnerService.show('processingSpinner');
          navigationService.getNextStep({transactionId: ratePremiumVM.transactionId});
        }
      };

      ratePremiumVM.navigateBack = function (form) {
        ratePremiumVM.formSubmitted = true;
        if (form.$valid) {

        }
      };

      ratePremiumVM.savePolicy = function (form) {
        ratePremiumVM.formSubmitted = true;
        if (form.$valid) {

        }
      }



    }
  ];
}
