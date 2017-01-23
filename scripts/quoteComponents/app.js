/**
 * Created by ngabelloa on 10/27/2016.
 */
'use strict';

angular.module('quotes.components.app', [
  'ui.router',
  'ui.bootstrap',
  'angular.filter',
  'ngMessages',
  'platform.logging',
  'platform.apiServices',
  'platform.lookupDataService',
  'platform.modal',
  'platform.error',
  'platform.events',
  'platform.journeyNavigation',
  'environment.config',
  'ui.grid',
  'ui.grid.pagination',
  'ui.bootstrap.pagination',
  'quickQuote.models',
  'quickQuotes.filters',
  'components.field',
  'quickQuotes.services',
  'quickQuote.config',
  'angularSpinners',
  'ui.tinymce'
])

  .controller('BaseCoverageSelectionController', BaseCoverageSelectionComponentCtrl())
  .config(['$stateProvider', 'Constants', function ($stateProvider, constants) {
    $stateProvider
      .state('root.quickQuote', {
        abstract: true,
        views: {
          'menuBar@root.quickQuote': {
            templateUrl: '../scripts/quoteComponents/pages/menuBar/menuBar.component.html',
            controller: MenuBarComponentCtrl(),
            controllerAs: 'menuBarVM'
          },
          '': {
            templateUrl: '../scripts/quoteComponents/pages/templates/quickQuoteTemplate/quickQuoteTemplate.component.html',
            controller: QuickQuoteTemplateCtrl(),
            controllerAs: 'quickQuoteVM'
          },
          'dashboard@root.quickQuote': {
            templateUrl: '../scripts/quoteComponents/pages/dashboard/dashboard.component.html',
            controller: DashboardComponentCtrl(),
            controllerAs: 'dashboardVM'
          }
        }
      })
      // .state('root.classSearch', {
      //   url: '/classSearch',
      //   templateUrl: '../scripts/quoteComponents/pages/classSearch/classSearch.component.html',
      //   controller: ClassSearchComponentCtrl(),
      //   controllerAs: 'classSearchVM',
      //   data: {
      //     transactionStep: constants.TransactionStep.ClassSearch,
      //     nextStep: constants.TransactionStep.AccountInformation
      //   }
      // })
    //   .state('root.classGuide', {
    //     url: '/classGuide/{sublineId:int}',
    //     templateUrl: '../scripts/quoteComponents/pages/classGuide/classGuide.component.html',
    //     controller: ClassGuideComponentCtrl(),
    //     controllerAs: 'classGuide'
    //   })
    //   .state('root.quickQuote.accountInformation', {
    //     url: '/account-information/:transactionId/:lobId',
    //     templateUrl: '../scripts/quoteComponents/pages/accountInformation/accountInfo.component.html',
    //     controller: AccountInformationComponentCtrl(),
    //     controllerAs: 'accountInfoVM',
    //     params: {
    //       accountData: null
    //     },
    //     data: {
    //       transactionStep: constants.TransactionStep.AccountInformation,
    //       nextStep: constants.TransactionStep.CoverageSelection,
    //       backStep: constants.TransactionStep.ClassSearch
    //     }
    //   })
    //   .state('root.quickQuote.lineOfBusinessSelection', {
    //     url: '/lineOfBusiness-selection/:transactionId',
    //     templateUrl: '../scripts/quoteComponents/pages/lineOfBusinessSelection/lineOfBusinessSelection.component.html',
    //     controller: LineOfBusinessSelectionComponentCtrl(),
    //     controllerAs: 'lobSelectionVM',
    //     params: {
    //       lobOrder: null,
    //       packageOptions: null,
    //       transactionStep: null
    //     },
    //     data: {
    //       lob: constants.LineOfBusiness.None
    //     }
    //   })
    //
    //   .state('root.quickQuote.glRatesPremium', {
    //     url: '/gl-rates-premium/:transactionId/:lobId',
    //     templateUrl: '../scripts/quoteComponents/pages/ratesPremiums/generalLiability/glRatesPremium.component.html',
    //     controller: GLRatesPremiumComponentCtrl(),
    //     controllerAs: 'glRatePremiumVM',
    //     data: {
    //       lob: constants.LineOfBusiness.GL,
    //       transactionStep: constants.TransactionStep.RatesPremiums,
    //       nextStep: constants.TransactionStep.AdditionalQuoteInformation,
    //       backStep: constants.TransactionStep.CoverageSelection
    //     }
    //   })
    //   .state('root.quickQuote.cfRatesPremium', {
    //     url: '/cf-rates-premium/:transactionId/:lobId',
    //     templateUrl: '../scripts/quoteComponents/pages/ratesPremiums/property/cfRatesPremium.component.html',
    //     controller: CFRatesPremiumComponentCtrl(),
    //     controllerAs: 'cfRatePremiumVM',
    //     data: {
    //       lob: constants.LineOfBusiness.CF,
    //       transactionStep: constants.TransactionStep.RatesPremiums,
    //       nextStep: constants.TransactionStep.AdditionalQuoteInformation,
    //       backStep: constants.TransactionStep.CoverageSelection
    //     }
    //   })
    //   .state('root.quickQuote.imRatesPremium', {
    //     url: '/im-rates-premium/:transactionId/:lobId',
    //     templateUrl: '../scripts/quoteComponents/pages/ratesPremiums/inlandMarine/imRatesPremium.component.html',
    //     controller: IMRatesPremiumComponentCtrl(),
    //     controllerAs: 'imRatePremiumVM',
    //     data: {
    //       lob: constants.LineOfBusiness.IM,
    //       transactionStep: constants.TransactionStep.RatesPremiums,
    //       nextStep: constants.TransactionStep.AdditionalQuoteInformation,
    //       backStep: constants.TransactionStep.CoverageSelection
    //     }
    //   })
    //   .state('root.quickQuote.llRatesPremium', {
    //     url: '/ll-rates-premium/:transactionId/:lobId',
    //     templateUrl: '../scripts/quoteComponents/pages/ratesPremiums/liquor/llRatesPremium.component.html',
    //     controller: LLRatesPremiumComponentCtrl(),
    //     controllerAs: 'llRatePremiumVM',
    //     data: {
    //       lob: constants.LineOfBusiness.LL,
    //       transactionStep: constants.TransactionStep.RatesPremiums,
    //       nextStep: constants.TransactionStep.AdditionalQuoteInformation,
    //       backStep: constants.TransactionStep.CoverageSelection
    //     }
    //   })
    //   .state('root.quickQuote.additionalQuoteInfo', {
    //     url: '/additional-quote-information/:transactionId',
    //     templateUrl: '../scripts/quoteComponents/pages/additionalInformation/additionalInfo.component.html',
    //     controller: AdditionalInformationComponentCtrl(),
    //     controllerAs: 'additionalInfoVM',
    //     params: {},
    //     data: {
    //       transactionStep: constants.TransactionStep.AdditionalQuoteInformation,
    //       nextStep: constants.TransactionStep.ReviewQuote,
    //       backStep: constants.TransactionStep.RatesPremiums
    //     }
    //   })
    //   .state('root.quickQuote.reviewQuote', {
    //     url: '/review-quote/:transactionId',
    //     templateUrl: '../scripts/quoteComponents/pages/reviewQuote/reviewQuote.component.html',
    //     controller: ReviewQuoteComponentCtrl(),
    //     controllerAs: 'reviewQuoteVM',
    //     data: {
    //       transactionStep: constants.TransactionStep.ReviewQuote,
    //       nextStep: constants.TransactionStep.AdditionalBindInformation,
    //       backStep: constants.TransactionStep.AdditionalQuoteInformation
    //     }
    //   })
    //   .state('root.quickQuote.additionalBindInfo', {
    //     url: '/additional-bind-information/:transactionId',
    //     templateUrl: '../scripts/quoteComponents/pages/additionalInformation/additionalInfo.component.html',
    //     controller: AdditionalInformationComponentCtrl(),
    //     controllerAs: 'additionalInfoVM',
    //     params: {},
    //     data: {
    //       transactionStep: constants.TransactionStep.AdditionalBindInformation,
    //       nextStep: constants.TransactionStep.ReviewBind,
    //       backStep: constants.TransactionStep.ReviewQuote
    //     }
    //   })
    //   .state('root.quickQuote.reviewBind', {
    //     url: '/review-bind',
    //     templateUrl: '../scripts/quoteComponents/pages/reviewBind/reviewBind.component.html',
    //     controller: ReviewBindComponentCtrl()
    //   })
    //   .state('root.quickQuote.reviewIssue', {
    //     url: '/review-issue',
    //     templateUrl: '../scripts/quoteComponents/pages/reviewIssue/reviewIssue.component.html',
    //     controller: ReviewIssueComponentCtrl()
    //   })
    // ;
    // //CoverageSelection routes
    // angular.forEach(constants.LineOfBusiness, function (value, key) {
    //
    //   if (value.Id === undefined) {
    //     return;
    //   }
    //   var lobId = value.Id.toLowerCase();
    //
    //   $stateProvider.state('root.quickQuote.' + lobId + 'CoverageSelection', {
    //     url: '/' + lobId + '-coverage-selection/:transactionId/:lobId',
    //     templateUrl: '../scripts/quoteComponents/pages/coverageSelection/' + value.Name + '/' + lobId + 'CoverageSelection.component.html',
    //     controller: GLCoverageSelectionComponentCtrl(),
    //     controllerAs: 'coverageVM',
    //     data: {
    //       lob: value,
    //       transactionStep: constants.TransactionStep.CoverageSelection,
    //       nextStep: constants.TransactionStep.RatesPremiums,
    //       backStep: constants.TransactionStep.AccountInformation
    //     }
    //   })
    // });

  }])
;
