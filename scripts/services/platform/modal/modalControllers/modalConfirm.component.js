/**
 * Created by ngabelloa on 11/17/2016.
 */
angular.module('platform.modal')
  .controller('modalConfirmController',
    ['$scope', '$rootScope', '$uibModalInstance', 'params',
      function ($scope, $rootScope, $uibModalInstance, params) {

        var confirmModalVM = this;

        //close modal when you navigate away
        $rootScope.$on('$locationChangeStart', function () {
          $uibModalInstance.close();
        });

        confirmModalVM.continue = function () {
          $uibModalInstance.close(true);
        };

        confirmModalVM.cancel = function () {
          $uibModalInstance.dismiss(false);
        };
      }
    ])
;
