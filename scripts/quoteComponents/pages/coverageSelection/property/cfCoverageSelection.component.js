
'use strict';

function CFCoverageSelectionComponentCtrl() {
return ['spinnerService', '$state', '$stateParams', 'LookupDataService', 'deliveryService', 'ErrorService', 'PolicyModel', 'decisionService', 'Constants',
    '$timeout', 'ModalService', 'HeaderDocumentService', 'navigationService', '$controller',
    function (spinnerService, $state, params, lookupData, deliveryService, errorService, policyModel, decisionService, constants,
              $timeout, modalService, headerDocumentService, navigationService, $controller) {

      var coverageVM = this;

      coverageVM.getData = function () {
        
      };

      coverageVM.getEvents = function () {
       
      };
      
      var baseController = $controller('BaseCoverageSelectionController', {coverageVM: coverageVM});
    }
  ];
}
