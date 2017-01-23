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

      var cplRatesPremiumsVM = this;
      cplRatesPremiumsVM.formSubmitted = false;
      cplRatesPremiumsVM.policy = policyModel.getPolicy();
      cplRatesPremiumsVM.transactionId = params.transactionId;
      cplRatesPremiumsVM.lob = $state.current.data.lob;
      cplRatesPremiumsVM.isInternalUser = headerDocumentService.getHeaderIsInternal();

      cplRatesPremiumsVM.continue = function (form) {
        cplRatesPremiumsVM.formSubmitted = true;
        if (form.$valid) {
          spinnerService.show('processingSpinner');
          navigationService.getNextStep({transactionId: cplRatesPremiumsVM.transactionId});
        }
      };

      cplRatesPremiumsVM.navigateBack = function (form) {
        cplRatesPremiumsVM.formSubmitted = true;
        if (form.$valid) {

        }
      };

      cplRatesPremiumsVM.savePolicy = function (form) {
        cplRatesPremiumsVM.formSubmitted = true;
        if (form.$valid) {

        }
      }



    }
  ];
}
