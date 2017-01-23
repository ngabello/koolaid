/**
 * Created by ngabelloa on 11/17/2016.
 */
'use strict';

function CFRatesPremiumComponentCtrl() {

  return ['spinnerService', '$state', '$stateParams', 'LookupDataService', 'deliveryService', 'ErrorService', 'PolicyModel', 'decisionService', 'Constants',
    '$timeout', 'ModalService', 'HeaderDocumentService', 'navigationService',
    function (spinnerService, $state, params, lookupData, deliveryService, errorService, policyModel, decisionService, constants,
              $timeout, modalService, headerDocumentService, navigationService) {

      spinnerService.hideAll();
      if (!lookupData.hasLookups() || !params.transactionId) {
        navigationService.goToAppStart();
        return;
      }

      var cfRatePremiumVM = this;
      cfRatePremiumVM.formSubmitted = false;
      cfRatePremiumVM.policy = policyModel.getPolicy();
      cfRatePremiumVM.transactionId = params.transactionId;
      cfRatePremiumVM.lob = $state.current.data.lob;
      cfRatePremiumVM.isInternalUser = headerDocumentService.getHeaderIsInternal();

      cfRatePremiumVM.continue = function (form) {
        cfRatePremiumVM.formSubmitted = true;
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

      cfRatePremiumVM.navigateBack = function (form) {
        cfRatePremiumVM.formSubmitted = true;
        if (form.$valid) {

        }
      };

      cfRatePremiumVM.savePolicy = function (form) {
        cfRatePremiumVM.formSubmitted = true;
        if (form.$valid) {

        }
      }



    }
  ];
}
