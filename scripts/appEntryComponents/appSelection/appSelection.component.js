/**
 * Created by ngabelloa on 12/19/2016.
 */
'use strict';

function AppSelectionComponentCtrl() {

  return ['$log', '$state', 'spinnerService', '$location', 'lookupService', 'ErrorService', 'navigationService',
    function ($log, $state, spinnerService, $location, lookupService, errorService , navigationService) {

      var appSelectionVM = this;
      appSelectionVM.lookupLoaded = false;

      lookupService.getLookupData().then(function(){
        appSelectionVM.lookupLoaded = true;
      }, function (error) {
        $log.error(String.format('Retrying getting lookup data'));
        lookupService.getLookupData().then(function(){
          appSelectionVM.lookupLoaded = true;
        }, function (error) {
          errorService.showSystemError('DashboardComponentCtrl: Failed to retrieve Lookup data with error', error);
          return;
        })
      });
      spinnerService.hideAll();

      appSelectionVM.startQuote = function(){
          $state.go('root.ClassSearch');
      };

      appSelectionVM.startCPL = function(){
        navigationService.loadFlowState('../scripts/utilities/cpl_journey.json').then(function () {
          console.dir($state.get());
          $state.go('root.ClassSearch');
        });
      }
    }
  ];
}
