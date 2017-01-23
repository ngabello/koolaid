/**
 * Created by ngabelloa on 1/6/2017.
 */
function BaseCoverageSelectionComponentCtrl() {
  'use strict';

  function UpdateRiskUnits(riskUnits) {
    var localRiskUnits = [];
    _.each(riskUnits, function (item) {
      localRiskUnits.push(
        {
          riskUnit: item,
          title: String.format('Location: {0}@|- | Class:{1}', item.LocationNumber, item.ClassCode),
          toolTipText: item.ClassDescription
        }
      )
    });
    return localRiskUnits;
  }

  // Parses out all the optional coverages and puts them into groups
  function UpdateCoverages(coverages, optionalCoverageTypes) {
    var coverageGroups = [];
    if (!coverages || coverages.length == 0) {
      return coverageGroups;
    }
    _.each(optionalCoverageTypes, function (optCoverageType) {
      var coverage = {
        Name: optCoverageType.desc,
        Code: optCoverageType.value,
        Display: optCoverageType.meta.display,
        SortOrder: optCoverageType.sortOrder,
        Id: optCoverageType.meta.optionCoverageTypeId,
        Coverages: []
      };
      //Filter optional coverages
      var filteredCoverages = _.filter(coverages, function (coverageItem) {
        return coverageItem.OptionalCoverageTypeId == optCoverageType.meta.optionalCoverageTypeId
          && (coverageItem.IsSelected || (!coverageItem.IsNonAssociated && !coverageItem.IsRemoved) || coverageItem.IsAddedByUnderwriter);
      });
      //Sort out all the coverages in the group
      if (filteredCoverages.length > 0) {
        coverage.Coverages = _.sortBy(filteredCoverages, function (filteredCovItem) {
          return filteredCovItem.Order;
        });
        coverageGroups.push(coverage);
      }
    });
    return _.sortBy(coverageGroups, function (coverageGroupItem) {
      return coverageGroupItem.SortOrder;
    });
  }

  // Parses out the Documents and puts them into sections
  function UpdateForms(documents, documentSections) {
    var formGroups = [];
    if (!documents || documents.length == 0) {
      return formGroups
    }

    _.each(documentSections, function (docSectionItem) {
      var docSection = {
        Name: docSectionItem.desc,
        SortOrder: docSectionItem.sortOrder,
        Forms: []
      };
      //Filter optional coverages
      var filteredDocItems = _.filter(documents, function (documentItem) {
        return documentItem.Section == docSectionItem.value;
      });
      if (filteredDocItems.length > 0) {
        docSection.Forms = _.sortBy(filteredDocItems, function (filteredDocItem) {
          return filteredDocItem.Order;
        });

        formGroups.push(docSection);
      }
    });
    return _.sortBy(formGroups, function (dg) {
      return dg.SortOrder;
    });
  };

  function UpdateLOBForm(viewModel, policyModel, lookupData) {
    viewModel.policy = policyModel.getPolicy();
    viewModel.riskUnits = UpdateRiskUnits(viewModel.policy[viewModel.lob.ModelName].RiskUnits);
    viewModel.coverageGroups = UpdateCoverages(viewModel.policy[viewModel.lob.ModelName].RollUp.OptionalCoverages, lookupData.getOptionalCoverageTypes());
    viewModel.formGroups = UpdateForms(viewModel.policy[viewModel.lob.ModelName].RollUp.Documents, lookupData.getDocumentSections());
  }

  return ['coverageVM', '$q', 'spinnerService', '$state', '$stateParams', 'LookupDataService', 'deliveryService', 'ErrorService', 'PolicyModel', 'decisionService', 'Constants',
    '$timeout', 'ModalService', 'HeaderDocumentService', 'navigationService',
    function (coverageVM, $q, spinnerService, $state, params, lookupData, deliveryService, errorService, policyModel, decisionService, constants,
      $timeout, modalService, headerDocumentService, navigationService) {

      if (!lookupData.hasLookups() || !params.transactionId) {
        navigationService.goToAppStart();
        return;
      }

      coverageVM.updateLOBForm = function () {
        UpdateLOBForm(coverageVM, policyModel, lookupData);
        coverageVM.getEvents();
      };

      coverageVM.getLookupData = function (service, lookupName) {
        deliveryService.getData(service).then(function (response) {
          coverageVM[lookupName] = response.Collection;
        }, function (error) {
          errorService.showSystemError('CoverageComponent: getLookupData failed', error);
        });
      };

      coverageVM.viewNotes = function (groupIndex, e) {
        var riskUnit = coverageVM.policy[coverageVM.lob.ModelName].RiskUnits[groupIndex];
        if (!riskUnit) {
          return;
        }
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        modalService.showNotes(coverageVM.policy.Id, riskUnit.Order, coverageVM.lob.Id);
      };

      coverageVM.removeClass = function (groupIndex, e) {
        var riskUnit = coverageVM.policy[coverageVM.lob.ModelName].RiskUnits[groupIndex];
        if (!riskUnit) {
          return;
        }
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        var modalInstance = modalService.showConfirm();
        modalInstance.result.then(function (result) {
          if (result) {
            var removeCriteria = {
              Id: coverageVM.policy.Id,
              ClassOrder: riskUnit.Order,
              Lob: coverageVM.lob.Id
            };
            spinnerService.show('processingSpinner');
            decisionService.removeRiskUnit(coverageVM.lob.Name, removeCriteria).then(function (removeRiskResult) {
              decisionService.getCoverageSelection(coverageVM.policy.Id, coverageVM.lob.Name).then(function (getCoverageResult) {
                UpdateLOBForm(coverageVM, policyModel, lookupData, coverageVM.lob.ModelName);
                spinnerService.hide('processingSpinner');
              }, function (error) {
                errorService.showSystemError('CoverageComponent: getCoverageSelection failed', error);
              });
            }, function (error) {
              errorService.showSystemError('CoverageComponent: removeClass call failed', error);
            });
          }
        }, function () {
          $log.error('Confirm modal returned an error on result')
        });
      };

      //Stops the Class accordion event from changing state when viewing notes or removing a class
      coverageVM.preventClassAccordionOpen = function (e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      coverageVM.documentAdded = function (documentId) {
        UpdateLOBForm(coverageVM, policyModel, lookupData);
      };

      coverageVM.classAdded = function () {
        UpdateLOBForm(coverageVM, policyModel, lookupData);
        coverageVM.riskAcc.isOpen[coverageVM.riskUnits.length - 1] = true;
      };

      coverageVM.valueChanged = function (answerValue, classOrder, service, isChecked, additionalParameters) {
        var params = {
          ClassOrder: classOrder,
          Id: coverageVM.policy.Id,
          Value: answerValue,
          IsChecked: isChecked,
          Lob: coverageVM.lob.Value,
          AdditionalParameters: additionalParameters
        };

        coverageVM.updateField(service, params);
      };

      coverageVM.updateField = function (service, params) {
        decisionService.updateField(service, params).then(function (result) {
          decisionService.getCoverageSelection(coverageVM.transactionId, coverageVM.lob.Name).then(function (getCoverageResult) {
            UpdateLOBForm(coverageVM, policyModel, lookupData);
          }, function (error) {
            errorService.showSystemError('CoverageComponent: getCoverageSelection failed', error);
          });
        }, function (error) {
          errorService.showSystemError('UpdateField', error);
        });
      };

      coverageVM.getSUM = function (list, prop) {
        return _.reduce(list, function (memo, obj) {
          return memo + parseFloat(obj[prop]);
        }, 0);
      };

      coverageVM.continue = function (form) {
        coverageVM.formSubmitted = true;
        if (form.$valid) {
          spinnerService.show('processingSpinner');
          decisionService.validatePolicy(coverageVM.transactionId, $state.current.data.pageName, coverageVM.lob).then(function (validatePolicyResult) {
            var lineOfBusiness = _.find(constants.LineOfBusiness, function (lob) {
              return lob.Value == validatePolicyResult.LobOrder[0].Code;
            });
            if (!lineOfBusiness) {
              throw 'CoverageSelectionComponentCtrl: continue failed, could not find LineOfBusiness';
            }
            navigationService.goNextStep({ transactionId: coverageVM.transactionId, lobId: lineOfBusiness.Id });
          }, function (error) {
            errorService.showSystemError('AccountInformationComponentCtrl: validatePolicy failed', error);
          });
        }
      };

      coverageVM.formSubmitted = false;
      coverageVM.transactionId = params.transactionId;
      coverageVM.lobId = params.lobId;
      coverageVM.lob = _.find(constants.LineOfBusiness, function (lob) {
        return lob.Id == coverageVM.lobId;
      });
      coverageVM.isInternalUser = headerDocumentService.getHeaderIsInternal();

      decisionService.getCoverageSelection(coverageVM.transactionId, coverageVM.lob.Name).then(function (getCoverageResult) {
        coverageVM.updateLOBForm();

        coverageVM.classAccordionState = true;
        coverageVM.riskAcc = { isOpen: new Array(coverageVM.riskUnits.length) };
        coverageVM.riskAcc.isOpen[0] = true;
        coverageVM.covAcc = { isOpen: new Array(coverageVM.coverageGroups.length) };
        coverageVM.formAcc = { isOpen: new Array(coverageVM.formGroups.length) };
      }, function (error) {
        errorService.showSystemError('CoverageComponent: getCoverageSelection failed', error);
      });

      coverageVM.getData();
    }
  ];
}
