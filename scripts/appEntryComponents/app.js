/**
 * Created by ngabelloa on 10/27/2016.
 */
'use strict';

angular.module('entry.components.app', [
  'ui.router',
  'LocalStorageModule',
  'angularSpinners',
  'platform.lookupDataService',
  'quickQuote.config'
])
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('root.appSelection', {
        url: '/appSelection',
        templateUrl: '../scripts/appEntryComponents/appSelection/appSelection.component.html',
        controller: AppSelectionComponentCtrl(),
        controllerAs: 'appSelectionVM'
      })
    ;
  }])

;
