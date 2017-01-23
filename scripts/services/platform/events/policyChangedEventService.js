/**
 * Created by ngabelloa on 12/20/2016.
 */
function PolicyChangedService() {
  'use strict';

  return ['$rootScope', function ($rootScope) {
      return {
        subscribe: function(scope, callback) {
          var handler = $rootScope.$on('policy-changed-event', callback);
          scope.$on('$destroy', handler);
        },

        notify: function() {
          $rootScope.$emit('policy-changed-event');
        }
      };
    }
  ];
}
