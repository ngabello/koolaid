/**
 * Created by ngabelloa on 1/20/2017.
 */
angular.module('platform.modal')
  .controller('modalAddViewAttachments',
    ['$scope', '$rootScope', '$uibModalInstance', 'params',
      function ($scope, $rootScope, $uibModalInstance, params) {

        var attachmentsModalVM = this;
        attachmentsModalVM.attachments = [];

        //close modal when you navigate away
        $rootScope.$on('$locationChangeStart', function () {
          $uibModalInstance.close();
        });

        attachmentsModalVM.confirm = function () {
          $uibModalInstance.close(true);
        };

        attachmentsModalVM.back = function () {
          $uibModalInstance.dismiss(false);
        };
      }
    ])
;
