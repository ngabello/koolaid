/**
 * Created by ngabelloa on 12/12/2016.
 */
'use strict';

function LineOfBusinessSelectionComponentCtrl() {

  return ['spinnerService', '$state', '$stateParams', 'LookupDataService', 'ErrorService', 'PolicyModel', 'decisionService', 'Constants', 'navigationService',
    function (spinnerService, $state, params, lookupData, errorService, policyModel, decisionService, constants, navigationService) {

      spinnerService.hideAll();
      var lobSelectionVM = this;
      lobSelectionVM.formSubmitted = false;
      lobSelectionVM.transactionId = params.transactionId;
      lobSelectionVM.lobOrder = params.lobOrder;
      lobSelectionVM.packageOptions = params.packageOptions;

      lobSelectionVM.addLineOfBusiness = function (lobId) {
        var nextLineOfBusiness = _.find(constants.LineOfBusiness, function (lob) {
          return lob.Value == lobId;
        });
        spinnerService.show('processingSpinner');
        decisionService.addLineOfBusiness(lobSelectionVM.transactionId, nextLineOfBusiness.Id).then(function (addLineOfBusinessResult) {
          //We always go back to coverageSelection Transaction
          navigationService.goNextLobStep(lobSelectionVM.transactionId, nextLineOfBusiness.Id, constants.TransactionStep.CoverageSelection.Name);
        }, function (error) {
          errorService.showSystemError(String.format('LineOfBusinessSelectionComponentCtrl: addLineOfBusiness call failed for lob {0}', nextLineOfBusiness.Name), error);
        });
      };
    }
  ];
}
