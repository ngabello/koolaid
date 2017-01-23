/**
 * Created by ngabelloa on 11/15/2016.
 */
angular.module('platform.modal')
  .controller('systemErrorController',
    ['$scope', '$rootScope', '$uibModalInstance', 'params',
      function ($scope, $rootScope, $uibModalInstance, params) {

        $scope.error = params.error;

        //close modal when you navigate away
        $rootScope.$on('$locationChangeStart', function () {
          $uibModalInstance.close();
        });

        $scope.continue = function () {
          $uibModalInstance.close();
        };



        $scope.cancel = function () {
          $uibModalInstance.close();
        };
      }
    ])
;
