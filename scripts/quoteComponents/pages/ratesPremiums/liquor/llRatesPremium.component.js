/**
 * Created by ngabelloa on 11/17/2016.
 */
'use strict';

function LLRatesPremiumComponentCtrl() {

  return ['spinnerService', '$state', '$stateParams', 'LookupDataService', 'deliveryService', 'ErrorService', 'PolicyModel', 'decisionService', 'Constants',
    '$timeout', 'ModalService', 'HeaderDocumentService', 'navigationService',
    function (spinnerService, $state, params, lookupData, deliveryService, errorService, policyModel, decisionService, constants,
              $timeout, modalService, headerDocumentService, navigationService) {

      spinnerService.hideAll();
      if (!lookupData.hasLookups() || !params.transactionId) {
        navigationService.goToAppStart();
        return;
      }

      var llRatePremiumVM = this;
      llRatePremiumVM.formSubmitted = false;
      llRatePremiumVM.policy = policyModel.getPolicy();
      llRatePremiumVM.transactionId = params.transactionId;
      llRatePremiumVM.lob = $state.current.data.lob;
      llRatePremiumVM.isInternalUser = headerDocumentService.getHeaderIsInternal();

      llRatePremiumVM.continue = function (form) {
        llRatePremiumVM.formSubmitted = true;
        if (form.$valid) {
          // decisionService.validatePolicy(coverageVM.transactionId, $state.current.data.transactionStep.Name, coverageVM.lob).then(function (validatePolicyResult) {
          //   var lineOfBusiness = _.find(constants.LineOfBusiness, function (lob) {
          //     return lob.Value == validatePolicyResult.LobOrder[0].Code;
          //   });
          //   if (!lineOfBusiness) {
          //     throw 'CoverageSelectionComponentCtrl: continue failed, could not find LineOfBusiness';
          //   }
          //   navigationService.goNextStep({transactionId: coverageVM.transactionId, lobId: lineOfBusiness.Id});
          // }, function (error) {
          //   errorService.showSystemError('AccountInformationComponentCtrl: validatePolicy failed', error);
          // });
        }
      };

      llRatePremiumVM.navigateBack = function (form) {
        llRatePremiumVM.formSubmitted = true;
        if (form.$valid) {

        }
      };

      llRatePremiumVM.savePolicy = function (form) {
        llRatePremiumVM.formSubmitted = true;
        if (form.$valid) {

        }
      }



    }
  ];
}
