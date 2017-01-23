'use strict';

function ClassSelectionComponent() {

    return {
        require: '^form',
        bindings: {
            lob: '<',
            policy: '=',
            classAdded: '&'
        },
        templateUrl: '../scripts/quoteComponents/field-components/classSelection/classSelection.component.html',
        controller: ['deliveryService', 'pdsService', 'decisionService', 'spinnerService', function(deliveryService, pdsService, decisionService, spinnerService) {

            var self = this;

            self.getClassCodes = function(searchCriteria) {
                return deliveryService.getSearchData(searchCriteria, self.lob.SublineType, 'true').then(function(response) {
                    self.classResults = response.Collection.map(function(item) {
                        return MapSrchData(item);
                    }, function(error) {
                        errorService.showSystemError('ClassSelection: getSearchData call failed', error);
                    });

                    return self.classResults;
                });
            };

            self.addClass = function(srchResult, form) {
                //if no srch results then exit
                if (!srchResult) {
                    form.classCodeSearch.$setValidity('required', false);
                    return;
                }
                form.classCodeSearch.$setValidity('required', true);
                //Build the request to add class
                var requestObj = {
                    MarkelRiskClassificationId: srchResult.HeaderId,
                    Subline: self.lob.Value,
                    Id: self.policy.Id
                };
                self.spinnerText = 'Adding Class';
                spinnerService.show('processingSpinner');
                //Call to add class
                decisionService.addClass(self.lob.Name, requestObj).then(function(addClassResult) {
                    decisionService.getCoverageSelection(addClassResult.Id, self.lob.Name).then(function(getCoverageResult) {
                        spinnerService.hide('processingSpinner');
                        self.classSrchResult = null;
                        //call the parent classAdded method
                        self.classAdded();
                    }, function(error) {
                        errorService.showSystemError('ClassSelection: getCoverageSelection failed', error);
                    });
                }, function(error) {
                    errorService.showSystemError('ClassSelection: addClass call failed', error);
                });
            };

            self.isDropDown = function() {
                return self.lob.Id == 'SpecialEvent' || self.lob.Id == 'LL'
            }

            if (self.isDropDown()) {
                self.getClassCodes('');
            }

            function MapSrchData(dataItem) {
                return ({
                    HeaderId: dataItem.HeaderId,
                    Code: dataItem.Code,
                    Description: dataItem.Code + ' - ' + dataItem.Description,
                    SubCode: dataItem.SubCode,
                    KeyWords: dataItem.KeyWords,
                    LineOfBusiness: dataItem.LineOfBusiness
                });
            }

        }]
    }
}