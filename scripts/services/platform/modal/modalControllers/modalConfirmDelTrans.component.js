/**
 * Created by ngabelloa on 11/17/2016.
 */
angular.module('platform.modal')
    .controller('modalConfirmDelTransController', ['$scope', '$rootScope', '$uibModalInstance', 'params',
        function($scope, $rootScope, $uibModalInstance, params) {

            var confirmDelTransModalVM = this;
            confirmDelTransModalVM.transactionId = params.transId;

            //close modal when you navigate away
            $rootScope.$on('$locationChangeStart', function() {
                $uibModalInstance.close();
            });

            confirmDelTransModalVM.confirm = function() {
                $uibModalInstance.close(true);
            };

            confirmDelTransModalVM.back = function() {
                $uibModalInstance.dismiss(false);
            };
        }
    ]);