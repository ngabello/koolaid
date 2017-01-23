/**
 * Created by ngabelloa on 11/16/2016.
 */
/**
 * Created by ngabelloa on 10/27/2016.
 */
'use strict';

function GeneralLiablityComponent() {

  function MapSrchData(dataItem) {
    return (
    {
      HeaderId: dataItem.HeaderId,
      Code: dataItem.Code,
      Description: dataItem.Code + ' - ' + dataItem.Description,
      SubCode: dataItem.SubCode,
      KeyWords: dataItem.KeyWords,
      LineOfBusiness: dataItem.LineOfBusiness
    });
  }

  function UpdateRiskUnits(riskUnits) {
    var localRiskUnits = [];
    _.each(riskUnits, function (item) {
      localRiskUnits.push(
        {
          riskUnit: item,
          title: String.format('Location: {0}@|- | Class:{1}', item.LocationNumber, item.ClassCode),
          templateUrl: '../scripts/quoteComponents/pages/coverageSelection/generalLiability/liabilityClass.component.html',
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


  function UpdateGlForm(glVM, policyModel, lookupData) {
    glVM.policy = policyModel.getPolicy();
    glVM.riskUnits = UpdateRiskUnits(glVM.policy.GlLine.RiskUnits);
    glVM.coverageGroups = UpdateCoverages(glVM.policy.GlLine.RollUp.OptionalCoverages, lookupData.getOptionalCoverageTypes());
    glVM.formGroups = UpdateForms(glVM.policy.GlLine.RollUp.Documents, lookupData.getDocumentSections());
  }

  return ['$scope', 'ModalService', '$log', 'PolicyModel', 'decisionService', 'deliveryService', 'ErrorService', 'Constants', 'LookupDataService', 'spinnerService',
    function ($scope, modalService, $log, policyModel, decisionService, deliveryService, errorService, constants, lookupData, spinnerService) {

      var glVM = this;
      glVM.policy = policyModel.getPolicy();
      glVM.lob = constants.LineOfBusiness.GL;
      glVM.policy.GlLine.watch = true;

      //Default the General Liability Accordion to open
      glVM.glcAccordionState = true;
      UpdateGlForm(glVM, policyModel, lookupData);
      glVM.glcAccordionState = true;
      glVM.riskAcc = { isOpen: new Array(glVM.riskUnits.length) };
      glVM.riskAcc.isOpen[0] = true;
      glVM.covAcc = { isOpen: new Array(glVM.coverageGroups.length)};
      glVM.formAcc = { isOpen: new Array(glVM.formGroups.length)};

      this.getClassCodes = function (searchCriteria) {
        return deliveryService.getSearchData(searchCriteria, 'GeneralLiability', 'true').then(function (response) {
          glVM.classSrchResults = response.Collection.map(function (item) {
            return MapSrchData(item);
          }, function (error) {
            errorService.showSystemError('GeneralLiablityComponent: getSearchData call failed', error);
          });
          return glVM.classSrchResults;
        });
      };

      glVM.addClass = function (srchResult, form) {
        //if no srch results then exit
        if (!srchResult) {
          form.classCodeSearch.$setValidity('required', false);
          return;
        }
        form.classCodeSearch.$setValidity('required', true);
        //Retrieve the LOB based on the results of the selected srch item
        var lineOfBusiness = _.find(constants.LineOfBusiness, function (lob) {
          return lob.Id == srchResult.LineOfBusiness;
        });
        //Build the request to add class
        var requestObj = {
          MarkelRiskClassificationId: srchResult.HeaderId,
          Subline: lineOfBusiness.Value,
          Id: glVM.policy.Id
        };
        spinnerService.show('processingSpinner');
        //Call to add class
        decisionService.addClass(lineOfBusiness.Name, requestObj).then(function (addClassResult) {
          decisionService.getCoverageSelection(addClassResult.Id, lineOfBusiness.Name).then(function (getCoverageResult) {
            glVM.classSrchResult = null;
            UpdateGlForm(glVM, policyModel, lookupData);
            glVM.riskAcc.isOpen[glVM.riskUnits.length - 1] = true;
            spinnerService.hide('processingSpinner');
          }, function (error) {
            errorService.showSystemError('GeneralLiabilityComponent: getCoverageSelection failed', error);
          });
        }, function (error) {
          errorService.showSystemError('GeneralLiabilityComponent: addClass call failed', error);
        });
      };

      glVM.viewNotes = function (groupIndex, e) {
        var riskUnit = glVM.policy.GlLine.RiskUnits[groupIndex];
        if (!riskUnit) {
          return;
        }
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        modalService.showNotes(glVM.policy.Id, riskUnit.Order, constants.LineOfBusiness.GL.Id);
      };

      glVM.removeClass = function (groupIndex, e) {
        var riskUnit = glVM.policy.GlLine.RiskUnits[groupIndex];
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
              Id: glVM.policy.Id,
              ClassOrder: riskUnit.Order,
              Lob: constants.LineOfBusiness.GL.Id
            };
            spinnerService.show('processingSpinner');
            decisionService.removeRiskUnit(constants.LineOfBusiness.GL.Name, removeCriteria).then(function (removeRiskResult) {
              decisionService.getCoverageSelection(glVM.policy.Id, constants.LineOfBusiness.GL.Name).then(function (getCoverageResult) {
                UpdateGlForm(glVM, policyModel, lookupData);
                spinnerService.hide('processingSpinner');
              }, function (error) {
                errorService.showSystemError('GeneralLiablityComponent: getCoverageSelection failed', error);
              });
            }, function (error) {
              errorService.showSystemError('GeneralLiablityComponent: removeClass call failed', error);
            });
          }
        }, function () {
          $log.error('Confirm modal returned an error on result')
        });
      };

      glVM.coverageItemChanged = function (selectedCoverage, coverageGroupId) {
        var requestObj = {
          AdditionalParameters: {
            Code: selectedCoverage.Code,
            SingleType: true
          },
          ClassOrder: selectedCoverage.Order,
          Id: glVM.policy.Id,
          IsChecked: selectedCoverage.IsSelected,
          Lob: constants.LineOfBusiness.GL.Value
        };
        console.log('blah');
      };

      //Stops the General Liability accordion event from changing state when viewing notes or removing a class
      glVM.preventGLCAccordionOpen = function (e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      glVM.documentAdded = function(documentId){
        UpdateGlForm(glVM, policyModel, lookupData);
      }

    }
  ];
}
