/**
 * Created by ngabelloa on 10/27/2016.
 */
'use strict';

function CPLAccountInformationComponentCtrl() {

  function saveContactData(accountInfoVM) {

    if (accountInfoVM.producerContactList) {
      if (accountInfoVM.accountData.ProducerContact.Email) {
        var producerContact = _.findWhere(accountInfoVM.producerContactList, {Email: accountInfoVM.accountData.ProducerContact.Email});
        accountInfoVM.accountData.ProducerContact.AmsId = producerContact.AmsId;
        accountInfoVM.accountData.ProducerContact.Name = producerContact.Name;
      }

      if (accountInfoVM.accountData.OnBehalfOfContact.Email && accountInfoVM.producerContactList.length > 0) {
        var onBehalfContact = _.findWhere(accountInfoVM.producerContactList, {Email: accountInfoVM.accountData.OnBehalfOfContact.Email});
        accountInfoVM.accountData.OnBehalfOfContact.AmsId = onBehalfContact.AmsId;
        accountInfoVM.accountData.OnBehalfOfContact.Name = onBehalfContact.Name;
      }
    }

    if (accountInfoVM.underwriters) {
      if (accountInfoVM.accountData.Underwriter.Email) {
        var underwriter = _.findWhere(accountInfoVM.underwriters, {value: accountInfoVM.accountData.Underwriter.Email});
        accountInfoVM.accountData.Underwriter.Name = underwriter.desc;
      }

      if (accountInfoVM.accountData.OnBehalfOfUnderwriter.Email) {
        var onBehalfOfUnderwriter = _.findWhere(accountInfoVM.underwriters, {value: accountInfoVM.accountData.OnBehalfOfUnderwriter.Email});
        accountInfoVM.accountData.OnBehalfOfUnderwriter.Name = onBehalfOfUnderwriter.desc
      }
    }
  }

  return ['$log', '$scope', '$state', '$stateParams', '$location', 'spinnerService', 'LookupDataService', 'deliveryService',
    'ErrorService', 'decisionService', 'Constants', 'navigationService', 'DecisionModel', 'HeaderDocumentService',
    function (logger, $scope, $state, params, $location, spinnerService, lookupData, deliveryService,
              errorService, decisionService, constants, navigationService, decisionModel, headerDocumentService) {


      if (!lookupData.hasLookups() || !params.transactionId) {
        navigationService.goToAppStart();
        return;
      }

      var accountInfoVM = this;
      accountInfoVM.accountData = decisionModel.getAccountInfo();
      accountInfoVM.accountData.Id = params.transactionId;
      accountInfoVM.isInternalUser = headerDocumentService.getHeaderIsInternal();

      accountInfoVM.transactionId = params.transactionId;
      accountInfoVM.lobId = params.lobId;
      accountInfoVM.stateList = lookupData.getStates();
      accountInfoVM.regionList = lookupData.getMarkelRegions();
      accountInfoVM.agencyList = [];
      accountInfoVM.producerContactList = [];
      //Default underwriters to first on selected
      accountInfoVM.underwriters = lookupData.getUnderwriters(accountInfoVM.regionList[0].meta.regionId);
      accountInfoVM.accountData.Underwriter.Email = accountInfoVM.underwriters[0].value;

      accountInfoVM.formSubmitted = false;

      accountInfoVM.policyAccordionStateOpen = true;
      accountInfoVM.contactAccordionStateOpen = true;
      accountInfoVM.accountAccordionStateOpen = true;

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
        return accountInfoVM.accountData.EffectiveDate;
      }), function (newVal, oldVal) {
        if (newVal == oldVal) {
          return;
        }
        if (!_.isDate(newVal)) {
          $scope.accountInfoForm.effectiveDate.$setValidity('invalidDate', false);
        } else {
          $scope.accountInfoForm.effectiveDate.$setValidity('invalidDate', true);
          decisionService.updateTransactionField(accountInfoVM.transactionId, 'EffectiveDate', newVal);
        }
      });

      $scope.$watch(angular.bind(accountInfoVM, function () {
        return accountInfoVM.accountData.ExpirationDate;
      }), function (newVal, oldVal) {
        if (newVal == oldVal) {
          return;
        }
        if (!_.isDate(newVal)) {
          $scope.accountInfoForm.expirationDate.$setValidity('invalidDate', false);
        } else {
          $scope.accountInfoForm.expirationDate.$setValidity('invalidDate', true);
          decisionService.updateTransactionField(accountInfoVM.transactionId, 'ExpirationDate', newVal);
        }
      });

      accountInfoVM.getAgencies = function (searchCriteria) {
        var amsCode = lookupData.getRegionAmsCode(accountInfoVM.accountData.RegionCode);
        return deliveryService.getAmsData(searchCriteria, amsCode).then(function (response) {
          accountInfoVM.agencyList = response.Collection;
          return accountInfoVM.agencyList;
        }, function (error) {
          errorService.showSystemError('AccountInformationComponentCtrl: Failed to retrieve AmsData with error', error);
        });
      };

      accountInfoVM.agencySearchChanged = function (item) {
        if (_.isObject(item)) {
          accountInfoVM.accountData.agencyName = item.Description;
          accountInfoVM.accountData.agencyLocation = item.City + ', ' + item.State;
          accountInfoVM.accountData.AgencyId = item.Id;
          accountInfoVM.accountData.AgencyCode = item.Code;
          accountInfoVM.accountData.AgencyName = item.Description;
          accountInfoVM.accountData.AgencyCity = item.City;
          accountInfoVM.accountData.AgencyState = item.State;
          accountInfoVM.accountData.AgencyZipCode = item.ZipCode;
          accountInfoVM.accountData.AgencyAddress1 = item.StreetAddress1;
          accountInfoVM.accountData.AgencyAddress2 = item.StreetAddress2;
          accountInfoVM.accountData.IsBrokerageAgency = item.IsBrokerage;

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
          accountInfoVM.accountData.RegionCode = regionCode;
          accountInfoVM.accountData.RegionDescription = region.desc;
        }
        accountInfoVM.accountData.underwriters = lookupData.getUnderwriters(region.meta.regionId);
        accountInfoVM.accountData.Underwriter.Email = accountInfoVM.underwriters[0].value
      };

      accountInfoVM.continue = function (form) {
        accountInfoVM.formSubmitted = true;
        if (!form.$valid) {
          angular.element($document[0].querySelector('input.ng-invalid')).focus();
          return;
        }
        spinnerService.show('processingSpinner');
        saveContactData(accountInfoVM);
        var lineOfBusiness = _.find(constants.LineOfBusiness, function (lob) {
          return lob.Id == accountInfoVM.lobId;
        });
        if (!lineOfBusiness) {
          throw 'CoverageSelectionComponentCtrl: continue failed, could not find LineOfBusiness';
          return;
        }
        decisionService.saveAccountInfo(accountInfoVM.accountData).then(function (saveAccountResult) {
          decisionService.validatePolicy(accountInfoVM.transactionId, $state.current.data.pageName, lineOfBusiness.Id).then(function (validatePolicyResult) {
              decisionService.getCoverageSelection(accountInfoVM.transactionId, lineOfBusiness.Name).then(function (getCoverageResult) {
                navigationService.getNextStep({transactionId: saveAccountResult.Id, lobId: accountInfoVM.lobId});
              }, function (error) {
                errorService.showSystemError('CoverageComponent: continue - getCoverageSelection failed', error);
              });
            },
            function (error) {
              errorService.showSystemError('AccountInformationComponentCtrl: continue - validatePolicy failed', error);
            });
        }, function (error) {
          errorService.showSystemError('AccountInformationComponentCtrl: continue- saveAccountInfo failed', error);
        });
      };

      accountInfoVM.saveQuote = function (form) {
        accountInfoVM.formSubmitted = true;
        if (!form.$valid) {
          angular.element($document[0].querySelector('input.ng-invalid')).focus();
          return;
        }
        spinnerService.show('processingSpinner');
        saveContactData(accountInfoVM);
        //TODO: check to see if saving may alter any data
        decisionService.saveAccountInfo(accountInfoVM.accountData).then(function (saveAccountResult) {
          decisionService.getAccountInformation(accountInfoVM.transactionId).then(function (getAccountInfoResult) {
            accountInfoVM.accountData = decisionModel.getAccountInfo();
            accountInfoVM.accountData.Id = params.transactionId;
            spinnerService.hide('processingSpinner');
          }, function (error) {
            errorService.showSystemError('ClassSearchComponentCtrl: adding class failed', error);
          });
        }, function (error) {
          errorService.showSystemError('AccountInformationComponentCtrl: saveQuote - saveAccountInfo failed', error);
        });
      };


    }
  ];
}
