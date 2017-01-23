/**
 * Created by ngabelloa on 12/19/2016.
 */
'use strict';

function MenuBarComponentCtrl() {

  return ['$log', '$rootScope', '$stateParams', 'policyChangedEventService',
    function (logger, $rootScope, params, policyChangedEventService) {

      var menuBarVM = this;
      menuBarVM.policyChangeCount = 0;

      policyChangedEventService.subscribe($rootScope, function somethingChanged() {
        // Handle notification
        menuBarVM.policyChangeCount++;
      });
    }
  ];
}
