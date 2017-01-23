/**
 * Created by ngabelloa on 12/15/2016.
 */
'use strict';
function CoveragePackagingComponent() {

  return {
    require: {parentForm: '^form'},
    bindings: {
      policy: '<'
    },
    templateUrl: '../scripts/quoteComponents/field-components/coveragePackaging/coveragePackaging.component.html',
    controller: ['Constants', 'decisionService', 'ModalService', '$stateParams', '$state', 'navigationService', 'ErrorService', 'spinnerService',
      function (constants, decisionService, modalService, $stateParams, $state, navigationService, errorService, spinnerService) {

        this.transactionId = $stateParams.transactionId;
        //defaults the Accordion to open
        this.packagingAccState = true;
        var self = this;


        this.addLob = function (lobId, form) {
          form.lineOfBusiness.$setValidity('required', true);
          if (!self.parentForm || !self.parentForm.$valid) {
            return;
          }
          //make sure we have lineOfBusiness selected
          if(form && form.lineOfBusiness && !form.lineOfBusiness.$modelValue){
            form.lineOfBusiness.$setValidity('required', false);
            return;
          }
          var nextLineOfBusiness = _.find(constants.LineOfBusiness, function (lob) {
            return lob.Value == lobId;
          });
          spinnerService.show('processingSpinner');
          decisionService.addLineOfBusiness(self.transactionId, nextLineOfBusiness.Id).then(function() {
            navigationService.goNextLobStep(self.transactionId, nextLineOfBusiness.Id);
          }, function (error) {
            errorService.showSystemError(String.format('CoveragePackagingComponent: addLineOfBusiness call failed for lob {0}', nextLineOfBusiness.Name), error);
          });
        };

      }]
  }
}
