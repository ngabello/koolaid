/**
 * Created by ngabelloa on 10/27/2016.
 */
'use strict';

function CPLReviewQuoteComponentCtrl() {

  return ['spinnerService', '$state', '$stateParams', 'LookupDataService', 'deliveryService', 'ErrorService', 'PolicyModel', 'decisionService', 'Constants',
    '$timeout', 'ModalService', 'HeaderDocumentService', 'navigationService',
    function (spinnerService, $state, params, lookupData, deliveryService, errorService, policyModel, decisionService, constants,
              $timeout, modalService, headerDocumentService, navigationService) {

      spinnerService.hideAll();
      if (!lookupData.hasLookups() || !params.transactionId) {
        navigationService.goToAppStart();
        return;
      }

      var reviewQuoteVM = this;
      reviewQuoteVM.formSubmitted = false;
      reviewQuoteVM.policy = policyModel.getPolicy();
      reviewQuoteVM.transactionId = params.transactionId;
      reviewQuoteVM.isInternalUser = headerDocumentService.getHeaderIsInternal();

      reviewQuoteVM.continue = function (form) {
        reviewQuoteVM.formSubmitted = true;
        if (form.$valid) {
          spinnerService.show('processingSpinner');
          navigationService.getNextStep({transactionId: reviewQuoteVM.transactionId});
        }
      };

      reviewQuoteVM.navigateBack = function (form) {
        reviewQuoteVM.formSubmitted = true;
        if (form.$valid) {

        }
      };

      reviewQuoteVM.savePolicy = function (form) {
        reviewQuoteVM.formSubmitted = true;
        if (form.$valid) {

        }
      }
    }
  ];
}

