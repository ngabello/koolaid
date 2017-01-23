/**
 * Created by ngabelloa on 10/27/2016.
 */
'use strict';

function CPLAdditionalInformationComponentCtrl() {

  return ['$log', '$scope', '$state', '$stateParams', '$location', 'spinnerService', 'LookupDataService', 'deliveryService',
    'ErrorService', 'PolicyModel', 'decisionService', 'Constants', 'navigationService',
    function (logger, $scope, $state, params, $location, spinnerService, lookupData, deliveryService, errorService, policyModel, decisionService, constants, navigationService) {


      if (!lookupData.hasLookups() || !params.transactionId) {
        navigationService.goToAppStart();
        return;
      }

      var additionalInfoVM = this;
      additionalInfoVM.transactionId = params.transactionId;
      additionalInfoVM.policyModel = policyModel.getPolicy();


      additionalInfoVM.continue = function (form) {
        additionalInfoVM.formSubmitted = true;
        if (form.$valid) {
          spinnerService.show('processingSpinner');
          navigationService.getNextStep({transactionId: additionalInfoVM.transactionId});
        }
      };

      additionalInfoVM.navigateBack = function (form) {
        additionalInfoVM.formSubmitted = true;
        if (form.$valid) {

        }
      };

      additionalInfoVM.savePolicy = function (form) {
        additionalInfoVM.formSubmitted = true;
        if (form.$valid) {

        }
      }

    }
  ];
}
