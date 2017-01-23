/**
 * Created by ngabelloa on 11/8/2016.
 */
'use strict';
function ClassGuideSearch() {

  function MapSrchData(dataItem) {
    return (
    {
      HeaderId: dataItem.headerId,
      Code: dataItem.code,
      Description: dataItem.description,
      SubCode: dataItem.subCode,
      KeyWords: dataItem.keyWords,
      LineOfBusiness: dataItem.lineOfBusiness
    });
  }

  function getSearchResults(self) {
    var classCodeResults;
    if (!self.uibClassCode && self.classCode) {
      classCodeResults = _.findWhere(self.srchResults, {HeaderId: self.classCode});
    } else {
      classCodeResults = self.uibClassCode;
    }
    return classCodeResults;
  }

  function GetLineOfBusiness(constants, self) {
    var nextLineOfBusiness = _.find(constants.LineOfBusiness, function (lob) {
      return lob.SublineTypeId == self.sublineType;
    });
    return nextLineOfBusiness;
  }

  return {
    require: '^form',
    bindings: {
      updateSearchResults: '&',
      updateQuoteRequest: '&'
    },
    templateUrl: '../scripts/quoteComponents/field-components/classGuideSearch/classGuideSearch.html',
    controller: ['deliveryService', 'pdsService',  'LookupDataService', 'HeaderDocumentService', 'QuickQuoteDataModelService', 'Constants',
      function (deliveryService,pdsService, lookupData, headerDocumentService, quickQuoteDataModelService, constants) {

        var self = this;
        this.showClassDropDown = false;
        this.srchResults = [];
        this.classCode = null;
        this.uibClassCode = null;
        this.submitted = false;
        this.test = false;

        this.selectedLob = null;
        this.allowedLobs = headerDocumentService.getHeaderAllowedLobs();
        if(this.allowedLobs.length == 1){
          this.selectedLob = this.allowedLobs[0];
        }

        this.lobTypeChanged = function (lobType) {
          self.classCode = null;
          self.uibClassCode = null;
          self.srchResults = [];

          if (lobType && lobType.DisplayType == 'select') {
            self.showClassDropDown = true;
            this.getClassCodes('');
          } else {
            self.showClassDropDown = false;
          }
        };

        this.getClassCodes = function (searchCriteria) {
          var nextLineOfBusiness = _.find(constants.LineOfBusiness, function (lob) {
            return lob.SublineTypeId == self.selectedLob.SublineTypeId;
          });

          return pdsService.getSearchData(searchCriteria, nextLineOfBusiness.SublineType, 'true').then(function (response) {
            self.srchResults = response.collection.map(function (item) {
              return MapSrchData(item);
            });
            return self.srchResults;
          });
        };

        this.viewClassGuide = function (form) {
          self.submitted = true;
          if (form.$valid) {
            var classCodeResults = getSearchResults(self);

            //TODO this will not work for property I guess
            // get the persisted srch results and update them
            var classGuideSearchResults = quickQuoteDataModelService.getLiabilityClassGuideRequest();
            classGuideSearchResults.ClassCode = classCodeResults.Code;
            classGuideSearchResults.EffectiveDate = moment().startOf('day').toDate();
            classGuideSearchResults.MarkelRiskClassificationId = classCodeResults.HeaderId;
            classGuideSearchResults.StateCode = headerDocumentService.getHeaderDefaultState();
            classGuideSearchResults.Subline = parseInt(self.selectedLob.SublineType);
            classGuideSearchResults.Description = classCodeResults.Description;
            classGuideSearchResults.SubCode = classCodeResults.SubCode;
            quickQuoteDataModelService.saveLiabilityClassGuideRequest(classGuideSearchResults);

            //notify parent controller that the View button has been pressed;
            self.updateSearchResults({classCode: classGuideSearchResults.ClassCode});
          }
        };

        this.getQuickQuote = function (form) {
          self.submitted = true;
          if (form.$valid) {
            var classCodeResults = getSearchResults(self);
            if (_.isObject(classCodeResults)) {
              classCodeResults.SublineType = parseInt(self.selectedLob.SublineTypeId);
              form.classCodeSearch.$setValidity('invalid', true);
              self.updateQuoteRequest({selectedItem: classCodeResults});
            } else {
              form.classCodeSearch.$setValidity('invalid', false);
            }
          }
        };
      }]
  }
}
