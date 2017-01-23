/**
 * Created by ngabelloa on 10/27/2016.
 */
'use strict';

function CPLReviewIssueComponentCtrl() {

  return ['spinnerService', '$state', '$stateParams', 'LookupDataService', 'deliveryService', 'ErrorService', 'PolicyModel', 'decisionService', 'Constants',
    '$timeout', 'ModalService', 'HeaderDocumentService', 'navigationService',
    function (spinnerService, $state, params, lookupData, deliveryService, errorService, policyModel, decisionService, constants,
              $timeout, modalService, headerDocumentService, navigationService) {

      spinnerService.hideAll();
      if (!lookupData.hasLookups() || !params.transactionId) {
        navigationService.goToAppStart();
        return;
      }

      var reviewIssueVM = this;
      reviewIssueVM.formSubmitted = false;
      reviewIssueVM.policy = policyModel.getPolicy();
      reviewIssueVM.transactionId = params.transactionId;
      reviewIssueVM.isInternalUser = headerDocumentService.getHeaderIsInternal();

      reviewIssueVM.continue = function (form) {
        reviewIssueVM.formSubmitted = true;
        if (form.$valid) {
          spinnerService.show('processingSpinner');
          navigationService.getNextStep({transactionId: reviewIssueVM.transactionId});
        }
      };

      reviewIssueVM.navigateBack = function (form) {
        reviewIssueVM.formSubmitted = true;
        if (form.$valid) {

        }
      };

      reviewIssueVM.savePolicy = function (form) {
        reviewIssueVM.formSubmitted = true;
        if (form.$valid) {

        }
      }



    }
  ];
}
