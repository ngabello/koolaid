/**
 * Created by ngabelloa on 12/12/2016.
 */
'use strict';
function LineOfBusinessSelectionBarComponent() {

  return {
    require: {parentForm: '^form'},
    bindings: {
      selectedLob: '<',
      policy: '<'
    },
    templateUrl: '../scripts/quoteComponents/field-components/lobSelectionBar/lobSelectionBar.component.html',
    controller: ['Constants', 'decisionService', 'ModalService', '$stateParams', '$state',  'ErrorService', 'spinnerService', 'navigationService',
      function (constants, decisionService, modalService, $stateParams, $state, errorService, spinnerService, navigationService) {

        this.transactionId = $stateParams.transactionId;
        var self = this;

        this.availableTabs = [];

        if(self.policy && self.policy.LobOrder) {
          _.each(this.policy.LobOrder, function (code) {
            var lobConst = _.find(constants.LineOfBusiness, function (lobItem) {
              return lobItem.Value == code.Code;
            });
            if (lobConst) {
              lobConst.Selected = !!(self.selectedLob && self.selectedLob.Id == lobConst.Id);
              self.availableTabs.push(lobConst);
            }
          });
        }

        this.addLob = function () {
          if (!self.parentForm || !self.parentForm.$valid) {
            return;
          }
          spinnerService.show('processingSpinner');
          decisionService.validatePolicy(self.transactionId, 'CoverageSelection', self.selectedLob.Id).then(function (validationResult) {
            //TODO: if invalid we should stop here
            //There are no LOB's left to edit so go to the LOB selection route
            navigationService.goLineOfBusinessSelection(self.transactionId);
          }, function (error) {
            errorService.showSystemError(String.format('LineOfBusinessSelectionBarComponent: validatePolicy call failed for lob {0}', self.selectedLob.Name), error);
          });
        };

        this.goToLob = function (lob) {
          if (!self.parentForm || !self.parentForm.$valid) {
            return;
          }
          spinnerService.show('processingSpinner');
          navigationService.goNextLobStep(self.transactionId, lob.Id);
        };

        this.removeLob = function (lob) {
          var modalInstance = modalService.showConfirm();
          modalInstance.result.then(function (result) {
            if (result) {
              spinnerService.show('processingSpinner');
              decisionService.removeLineOfBusiness(self.transactionId, lob.Id).then(function (removeResult) {
                //Are there any LOB's left if yes than transition to that route
                var lobOrder = removeResult.LobOrder;
                if (lobOrder && lobOrder.length > 0) {
                  var nextLineOfBusiness = _.find(constants.LineOfBusiness, function (lob) {
                    return lob.Value == lobOrder[0].Code;
                  });
                  navigationService.goNextLobStep(self.transactionId, nextLineOfBusiness.Id);
                } else {
                  //There are no LOB's left to edit so go to the LOB selection route
                  navigationService.goLineOfBusinessSelection(self.transactionId);
                }
              }, function (error) {
                errorService.showSystemError(String.format('LineOfBusinessSelectionBarComponent: removeLineOfBusiness call failed for lob {0}', lob.Name), error);
              });
            }
          });
        }
      }]
  }
}
