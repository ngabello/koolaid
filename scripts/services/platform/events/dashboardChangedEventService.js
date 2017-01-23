/**
 * Created by ngabelloa on 12/20/2016.
 */
function DashboardChangedService() {
  'use strict';

  return ['$rootScope', function ($rootScope) {
      return {
        subscribe: function(scope, callback) {
          var handler = $rootScope.$on('dashboard-changed-event', callback);
          scope.$on('$destroy', handler);
        },

        notify: function() {
          $rootScope.$emit('dashboard-changed-event');
        }
      };
    }
  ];
}
