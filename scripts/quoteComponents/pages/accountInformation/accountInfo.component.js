/**
 * Created by ngabelloa on 10/27/2016.
 */
'use strict';

function AccountInformationComponentCtrl() {

  return ['$log', '$scope', '$state', '$stateParams', '$location', 'spinnerService', 'LookupDataService', 'deliveryService',
    'ErrorService', 'PolicyModel', 'decisionService', 'Constants', 'navigationService',
    function (logger, $scope, $state, params, $location, spinnerService, lookupData, deliveryService, errorService, policyModel, decisionService, constants, navigationService) {


      if (!lookupData.hasLookups() || !params.transactionId) {
        navigationService.goToAppStart();
        return;
      }

      var accountInfoVM = this;
      accountInfoVM.transactionId = params.transactionId;
      accountInfoVM.lobId = params.lobId;

      accountInfoVM.policyModel = policyModel.getPolicy();
      accountInfoVM.policyModel.Id = accountInfoVM.transactionId;
      accountInfoVM.stateList = lookupData.getStates();
      accountInfoVM.regionList = lookupData.getMarkelRegions();
      accountInfoVM.agencyList = [];
      accountInfoVM.producerContactList = [];
      //Default underwriters to first on selected
      accountInfoVM.underwriters = lookupData.getUnderwriters(accountInfoVM.regionList[0].meta.regionId);
      accountInfoVM.underwriterEmail = accountInfoVM.underwriters[0].value;

      accountInfoVM.producerEmail = null;
      accountInfoVM.underwriterEmail = null;
      accountInfoVM.onBehalfOfUnderwriterEmail = null;
      accountInfoVM.onBehalfOfContactEmail = null;
      accountInfoVM.producerEmail = null;
      accountInfoVM.agencySearchResult = null;
      accountInfoVM.agencyName = null;
      accountInfoVM.agencyCode = null;
      accountInfoVM.agencyLocation = null;
      accountInfoVM.formSubmitted = false;

      accountInfoVM.policyAccordionStateOpen = true;
      accountInfoVM.contactAccordionStateOpen = true;
      accountInfoVM.accountAccordionStateOpen = false;

      accountInfoVM.expirationDateOptions = {
        maxDate: moment().add(3, 'year').toDate(),
        minDate: moment().subtract(12, 'month').toDate(),
        showWeeks: false
      };

      accountInfoVM.effectiveDateOptions = {
        maxDate: moment().add(4, 'year').toDate(),
        minDate: moment().subtract(2, 'month').toDate(),
        showWeeks: false
      };

      accountInfoVM.openEffectiveDate = function () {
        accountInfoVM.dpEffectiveDate.opened = true;
      };

      accountInfoVM.openExpirationDate = function () {
        accountInfoVM.dpExpirationDate.opened = true;
      };

      accountInfoVM.dpEffectiveDate = {
        opened: false
      };

      accountInfoVM.dpExpirationDate = {
        opened: false
      };

      $scope.$watch(angular.bind(accountInfoVM, function () {
        return accountInfoVM.policyModel.EffectiveDate;
      }), function (newVal, oldVal) {
        if (!_.isDate(newVal)) {
          $scope.accountInfoForm.effectiveDate.$setValidity('invalidDate', false);
          return;
        } else {
          $scope.accountInfoForm.effectiveDate.$setValidity('invalidDate', true);
          decisionService.updateTransactionField(accountInfoVM.transactionId, 'EffectiveDate', newVal);
        }
      });

      $scope.$watch(angular.bind(accountInfoVM, function () {
        return accountInfoVM.policyModel.ExpirationDate;
      }), function (newVal, oldVal) {
        if (!_.isDate(newVal)) {
          $scope.accountInfoForm.expirationDate.$setValidity('invalidDate', false);
          return;
        } else {
          $scope.accountInfoForm.expirationDate.$setValidity('invalidDate', true);
          decisionService.updateTransactionField(accountInfoVM.transactionId, 'ExpirationDate', newVal);
        }
      });

      accountInfoVM.CheckLineOfBusiness = function (lob) {
        var lobItem = _.findWhere(accountInfoVM.policyModel.LobOrder, {Code: lob});
        if (lobItem) {
          return true;
        } else {
          return false;
        }
      };

      accountInfoVM.continue = function (form) {
        accountInfoVM.formSubmitted = true;
        if (form.$valid) {

          spinnerService.show('processingSpinner');

          var producerContact = _.findWhere(accountInfoVM.producerContactList, {Email: accountInfoVM.producerEmail});
          accountInfoVM.policyModel.ProducerContact = {
            AmsId: producerContact.AmsId,
            Email: producerContact.Email,
            Name: producerContact.Name
          };
          if (accountInfoVM.onBehalfOfContactEmail) {
            var onBehalfContact = _.findWhere(accountInfoVM.producerContactList, {Email: accountInfoVM.onBehalfOfContactEmail});
            accountInfoVM.policyModel.OnBehalfOfContact = {
              AmsId: onBehalfContact.AmsId,
              Email: onBehalfContact.Email,
              Name: onBehalfContact.Name
            };
          }
          var underwriter = _.findWhere(accountInfoVM.underwriters, {value: accountInfoVM.underwriterEmail});
          accountInfoVM.policyModel.Underwriter = {
            Email: underwriter.value,
            Name: underwriter.desc
          };
          if (accountInfoVM.onBehalfOfUnderwriterEmail) {
            var onBehalfOfUnderwriter = _.findWhere(accountInfoVM.underwriters, {value: accountInfoVM.onBehalfOfUnderwriterEmail});
            accountInfoVM.policyModel.OnBehalfOfUnderwriter = {
              Email: onBehalfOfUnderwriter.value,
              Name: onBehalfOfUnderwriter.desc
            };
          }

          decisionService.saveAccountInfo(accountInfoVM.policyModel).then(function (saveAccountResult) {
            navigationService.getNextStep({transactionId: saveAccountResult.Id, lobId:accountInfoVM.lobId});
          }, function (error) {
            errorService.showSystemError('AccountInformationComponentCtrl: saveAccountInfo failed', error);
          });
        }
      };

      accountInfoVM.saveQuote = function (form) {
        accountInfoVM.formSubmitted = true;
        if (form.$valid) {
         //TODO: check to see if saving may alter any data
          decisionService.saveAccountInfo(accountInfoVM.policyModel);
        }
      };

      accountInfoVM.getAgencies = function (searchCriteria) {
        var amsCode = lookupData.getRegionAmsCode(accountInfoVM.policyModel.Region);
        return deliveryService.getAmsData(searchCriteria, amsCode).then(function (response) {
          accountInfoVM.agencyList = response.Collection;
          return accountInfoVM.agencyList;
        }, function (error) {
          errorService.showSystemError('AccountInformationComponentCtrl: Failed to retrieve AmsData with error', error);
        });
      };

      accountInfoVM.agencySearchChanged = function (item) {
        if (_.isObject(item)) {
          accountInfoVM.agencyCode = item.Code;
          accountInfoVM.agencyName = item.Description;
          accountInfoVM.agencyLocation = item.City + ', ' + item.State;

          accountInfoVM.policyModel.AgencyId = item.Id;
          accountInfoVM.policyModel.AgencyCode = item.Code;
          accountInfoVM.policyModel.AgencyName = item.Description;
          accountInfoVM.policyModel.AgencyCity = item.City;
          accountInfoVM.policyModel.AgencyState = item.State;
          accountInfoVM.policyModel.AgencyZipCode = item.ZipCode;
          accountInfoVM.policyModel.AgencyAddress1 = item.StreetAddress1;
          accountInfoVM.policyModel.AgencyAddress2 = item.StreetAddress2;
          accountInfoVM.policyModel.IsBrokerageAgency = item.IsBrokerage;

          deliveryService.getProducerContacts(item.Id).then(function (response) {
            accountInfoVM.producerContactList = response.Collection;
            return;
          }, function (error) {
            errorService.showSystemError('AccountInformationComponentCtrl: Failed to retrieve ProducerContacts with error', error);
          });
        }
      };

      accountInfoVM.regionChanged = function (regionCode) {
        var region = _.findWhere(accountInfoVM.regionList, {value: regionCode});
        if (region) {
          accountInfoVM.policyModel.RegionCode = regionCode;
          accountInfoVM.policyModel.RegionDescription = region.desc;
        }
        accountInfoVM.underwriters = lookupData.getUnderwriters(region.meta.regionId);
        accountInfoVM.underwriterEmail = accountInfoVM.underwriters[0].value
      }
    }
  ];
}
