/**
 * Created by ngabelloa on 10/27/2016.
 */
'use strict';

function CoverageSelectionComponentCtrl() {

  function getAvailableTabs(constants, lobOrder) {
    var availableTabs = [
      {
        lob: constants.LineOfBusiness.GL,
        templateUrl: '../scripts/quoteComponents/pages/coverageSelection/generalLiability/generalLiability.component.html',
        index: 0
      },
      {
        lob: constants.LineOfBusiness.CF,
        templateUrl: '../scripts/quoteComponents/pages/coverageSelection/property/property.component.html',
        index: 1
      },
      {
        lob: constants.LineOfBusiness.XS,
        templateUrl: '../scripts/quoteComponents/pages/coverageSelection/liquorLiability/liquorLiability.component.html',
        index: 2
      },
      {
        lob: constants.LineOfBusiness.IM,
        templateUrl: '../scripts/quoteComponents/pages/coverageSelection/inlandMarine/inlandMarine.component.html',
        index: 3
      },
      {
        lob: constants.LineOfBusiness.OCP,
        templateUrl: './scripts/quoteComponents/pages/coverageSelection/liquorLiability/liquorLiability.component.html',
        index: 4
      },
      {
        lob: constants.LineOfBusiness.LL,
        templateUrl: '../scripts/quoteComponents/pages/coverageSelection/liquorLiability/liquorLiability.component.html',
        index: 5
      },
      {
        lob: constants.LineOfBusiness.SpecialEvent,
        templateUrl: '../scripts/quoteComponents/pages/coverageSelection/inlandMarine/inlandMarine.component.html',
        index: 6
      }
    ];

    var selectedTabs = [];
    var index = 0;
    _.each(lobOrder, function (lobItem) {
      var availableTab = _.find(availableTabs, function (tabItem) {
        return tabItem.lob.Value == lobItem.Code;
      });
      if (availableTab) {
        availableTab.index = index;
        selectedTabs.push(availableTab);
        index++;
      }
    });
    return selectedTabs;
  }

  function updateTabs(csVM, policyModel, constants) {
    csVM.policyModel = policyModel.getPolicy();
    csVM.packageOptions = csVM.policyModel.PackageOptions;
    csVM.availableTabs = [];
    csVM.availableTabs = getAvailableTabs(constants, csVM.policyModel.LobOrder);
  }

  function UpdateCurrentCoverage(decisionService, csVM, nextLineOfBusiness, policyModel, $timeout, errorService) {
    decisionService.getCoverageSelection(csVM.transactionId, nextLineOfBusiness.Name).then(function (coverageSelectionResult) {
      //Set the active LineOfBusiness
      csVM.activeLob = nextLineOfBusiness;
      //Reset the tabs
      updateTabs(csVM, policyModel, csVM.constants);
      var nextTab = _.find(csVM.availableTabs, function (tabItem) {
        return tabItem.lob.Id == nextLineOfBusiness.Id;
      });
      if (nextTab) {
        $timeout(function () {
          csVM.activeTabIndex = nextTab.index;
        });
      }
    }, function (error) {
      errorService.showSystemError(String.format('CoverageSelectionComponentCtrl: getCoverageSelection call failed for lob {0}', nextLineOfBusiness.Name), error);
    });
  }

  return ['spinnerService', '$state', '$stateParams', 'LookupDataService', 'deliveryService', 'ErrorService', 'PolicyModel', 'decisionService', 'Constants', '$timeout', 'ModalService',
    function (spinnerService, $state, params, lookupData, deliveryService, errorService, policyModel, decisionService, constants, $timeout, modalService) {

      spinnerService.hideAll();
      var csVM = this;
      csVM.formSubmitted = false;
      csVM.constants = constants;
      csVM.transactionId = params.transactionId;
      csVM.activeLob = policyModel.getLineOfBusiness();
      updateTabs(csVM, policyModel, csVM.constants);
      //default the first tab as active
      $timeout(function () {
        csVM.activeTabIndex = 0;
      });


      //region tab events
      csVM.addLineOfBusiness = function (lobId) {
        var nextLineOfBusiness = _.find(csVM.constants.LineOfBusiness, function (lob) {
          return lob.Value == lobId;
        });
        //Validate the current tab
        decisionService.validatePolicy(csVM.transactionId, 'CoverageSelection', csVM.activeLob.Id).then(function (validationResult) {
          decisionService.addLineOfBusiness(csVM.transactionId, nextLineOfBusiness.Id).then(function (addLineOfBusinessResult) {
            //Retrieves the coverage selection
            UpdateCurrentCoverage(decisionService, csVM, nextLineOfBusiness, policyModel, $timeout, errorService);
          }, function (error) {
            errorService.showSystemError(String.format('CoverageSelectionComponentCtrl: addLineOfBusiness call failed for lob {0}', nextLineOfBusiness.Name), error);
          });
        }, function (error) {
          errorService.showSystemError(String.format('CoverageSelectionComponentCtrl: validatePolicy call failed for lob {0}', csVM.activeLob.Name), error);
        });
      };


      csVM.tabSelected = function (lineOfBusiness) {
        decisionService.validatePolicy(csVM.transactionId, 'CoverageSelection', lineOfBusiness.Id).then(function (validationResult) {
          decisionService.getCoverageSelection(csVM.transactionId, lineOfBusiness.Name).then(function (coverageSelectionResult) {
            csVM.policyModel = policyModel.getPolicy();
            csVM.packageOptions = csVM.policyModel.PackageOptions;
          }, function (error) {
            errorService.showSystemError(String.format('CoverageSelectionComponentCtrl: getCoverageSelection call failed for lob {0}', lineOfBusiness.Name), error);
          })
        }, function (error) {
          errorService.showSystemError(String.format('CoverageSelectionComponentCtrl: validatePolicy call failed for lob {0}', lineOfBusiness.Name), error);
        });
      };

      csVM.removeTab = function (e, lobId) {
        var modalInstance = modalService.showConfirm();
        modalInstance.result.then(function (result) {
          if (result) {
            decisionService.removeLineOfBusiness(csVM.transactionId, lobId).then(function (removeResult) {
              var lobOrder = removeResult.LobOrder;
              if (lobOrder && lobOrder.length > 0) {
                var nextLineOfBusiness = _.find(csVM.constants.LineOfBusiness, function (lob) {
                  return lob.Value == lobOrder[0].Code;
                });
                //Retrieves the coverage selection
                UpdateCurrentCoverage(decisionService, csVM, nextLineOfBusiness, policyModel, $timeout, errorService);
              } else {
                //Clear out all tabs
                csVM.availableTabs = [];
                csVM.activeLob = {};
                decisionService.lobSelection(csVM.transactionId).then(function (selectionResult) {
                  csVM.policyModel = policyModel.getPolicy();
                  csVM.packageOptions = csVM.policyModel.PackageOptions;
                }, function (error) {
                  errorService.showSystemError('CoverageSelectionComponentCtrl: lobSelection call failed', error);
                });
              }
            }, function (error) {
              errorService.showSystemError(String.format('CoverageSelectionComponentCtrl: removeLineOfBusiness call failed for lob {0}', lineOfBusiness.Name), error);
            });
          }
        });
        //Prevent the tab click event
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      //endregion

      csVM.continue = function (form) {
        csVM.formSubmitted = true;
        if (form.$valid) {
          $state.go('glRatesPremium', {transactionId: saveAccountResult.Id});

        }
      };

      csVM.saveQuote = function (form) {
        csVM.formSubmitted = true;
        if (form.$valid) {

        }
      };

    }
  ];
}
