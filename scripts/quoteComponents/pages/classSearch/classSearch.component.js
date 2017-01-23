/**
 * Created by ngabelloa on 10/27/2016.
 */
'use strict';

function ClassSearchComponentCtrl() {

  return ['$log', '$state', '$location', 'spinnerService', 'LookupDataService', 'ModalService', 'decisionService', 'ErrorService', 'Constants', 'PolicyModel', 'navigationService',
    function (logger, $state, $location, spinnerService, lookupData, modalService, decisionService, errorService, constants, policyModel, navigationService) {

      if(!lookupData.hasLookups()){
        $state.go('dashboard');
        return;
      }

      var classSearchVM = this;
      classSearchVM.constants = constants;

      logger.info('Loading accountInfo page');
      spinnerService.hideAll();

      classSearchVM.srchResultsChanged = function(sublineId){
        $state.go('root.classGuide', {sublineId: sublineId});
        return;
      };

      classSearchVM.quoteRequested = function(selectedItem){
        spinnerService.show('processingSpinner');

        var lineOfBusiness = _.find(classSearchVM.constants.LineOfBusiness, function(lob){
          return lob.SublineTypeId == selectedItem.SublineType;
        });

        var requestObj = {
          EffectiveDate: new Date(),
          ClassCode: selectedItem.Code,
          MarkelRiskClassificationId: selectedItem.HeaderId,
          SearchText: selectedItem.Description,
          Subline: selectedItem.SublineType
        };

        decisionService.addClass(lineOfBusiness.Name, requestObj).then(function(addClassResult){
          decisionService.getAccountInformation(addClassResult.Id).then(function(getAccountInfoResult){
            navigationService.getNextStep({transactionId: addClassResult.Id}, {lobId: lineOfBusiness.Id});
            return;
          }, function (error) {
            errorService.showSystemError('ClassSearchComponentCtrl: adding class failed', error);
          });
        }, function (error) {
          errorService.showSystemError('ClassSearchComponentCtrl: get Account Information call failed', error);
        });
      };

      classSearchVM.showModal = function(){
        modalService.showSystemError();
      }

    }
  ];
}
