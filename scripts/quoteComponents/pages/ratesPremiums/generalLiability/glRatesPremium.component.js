/**
 * Created by ngabelloa on 11/17/2016.
 */
'use strict';

function GLRatesPremiumComponentCtrl() {

  return ['spinnerService', '$state', '$stateParams', 'LookupDataService', 'deliveryService', 'ErrorService', 'PolicyModel', 'decisionService', 'Constants',
    '$timeout', 'ModalService', 'HeaderDocumentService', 'navigationService',
    function (spinnerService, $state, params, lookupData, deliveryService, errorService, policyModel, decisionService, constants,
              $timeout, modalService, headerDocumentService, navigationService) {

      spinnerService.hideAll();
      if (!lookupData.hasLookups() || !params.transactionId) {
        navigationService.goToAppStart();
        return;
      }

      var glRatePremiumVM = this;
      glRatePremiumVM.formSubmitted = false;
      glRatePremiumVM.policy = policyModel.getPolicy();
      glRatePremiumVM.transactionId = params.transactionId;
      glRatePremiumVM.lob = $state.current.data.lob;
      glRatePremiumVM.isInternalUser = headerDocumentService.getHeaderIsInternal();

      glRatePremiumVM.continue = function (form) {
        glRatePremiumVM.formSubmitted = true;
        if (form.$valid) {
          spinnerService.show('processingSpinner');
          navigationService.goNextStep({transactionId: glRatePremiumVM.transactionId});
        }
      };

      glRatePremiumVM.navigateBack = function (form) {
        glRatePremiumVM.formSubmitted = true;
        if (form.$valid) {

        }
      };

      glRatePremiumVM.savePolicy = function (form) {
        glRatePremiumVM.formSubmitted = true;
        if (form.$valid) {

        }
      }



    }
  ];
}
