'use strict';
var modules = [
  'ui.router',
  'LocalStorageModule',
  'angularSpinners',
  'entry.components.app',
  'quotes.components.app',
  'logglyLogger',
  'ApplicationInsightsModule'
];

angular.module('markelOnlineApp', modules)
  .controller('mainController', ['$scope', 'spinnerService', function ($scope, spinnerService) {
    $scope.spinnerLoaded = function (mySpinner) {
      spinnerService.show('processingSpinner');
    };
  }])
  .config(function (LogglyLoggerProvider) {
    LogglyLoggerProvider.inputToken('853fbac4-9a65-459a-bb56-6dc5aa3357f8')
      .sendConsoleErrors(true)
      .level('DEBUG')
      .includeUrl(false)
      .includeTimestamp(true);
  })
  .config(function(applicationInsightsServiceProvider){
    var options = {applicationName:'ng-markelOnline'};
    // Configuration options are described below
    applicationInsightsServiceProvider.configure('45c04442-7231-45ed-9970-c477f1bd74b8', options );
  })
  .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.when('', '/appSelection');
      $urlRouterProvider.otherwise('/appSelection');
      //$urlRouterProvider.otherwise('/404');

      $stateProvider
        .state('root',{
          abstract: true,
          url: '',
          views: {
            'header': {
              templateUrl: '../views/platform/header/header.component.html',
              controller: HeaderComponentCtrl(),
              controllerAs: 'headerVM'
            },
            '':{
              template: '<div><div ui-view></div></div>'
            },
            'footer': {
              templateUrl: '../views/platform/footer/footer.component.html',
              controller: FooterComponentCtrl(),
              controllerAs: 'footerVM'
            }
          }
        })
      ;
    }])
  .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('markelOnline');
  }])
  .directive('onlyDigits', OnlyDigits())
  .directive('addQuestion', AddQuestion())
;
