/**
 * Created by ngabelloa on 11/15/2016.
 */
function ModalService() {
    'use strict';

    function _showSystemError($uibModal, error) {
        var opts = {
            templateUrl: '../scripts/services/platform/modal/templates/errorTemplate.html',
            backdrop: 'static',
            controller: 'systemErrorController',
            //controllerAs: '$systemError',
            resolve: {
                params: function() {
                    return {
                        error: error
                    };
                }
            }
        };

        return $uibModal.open(opts);
    }

    function _showNotes($uibModal, classId, classOrder, lob) {
        var opts = {
            templateUrl: '../scripts/services/platform/modal/templates/notesTemplate.html',
            backdrop: 'static',
            controller: 'modalNotesController',
            controllerAs: 'notesModalVM',
            resolve: {
                params: function() {
                    return {
                        classId: classId,
                        classOrder: classOrder,
                        lob: lob
                    };
                }
            }
        };
        return $uibModal.open(opts);
    }

    function _showConfirm($uibModal) {
        var modalInstance = $uibModal.open({
            templateUrl: '../scripts/services/platform/modal/templates/confirmTemplate.html',
            controller: 'modalConfirmController',
            controllerAs: 'confirmModalVM',
            resolve: {
                params: function() {
                    return null;
                }
            }
        });
        return modalInstance;
    }

    function _showConfirmDeleteTransaction($uibModal, transactionId) {
        var modalInstance = $uibModal.open({
            templateUrl: '../scripts/services/platform/modal/templates/confirmDelTransTemplate.html',
            controller: 'modalConfirmDelTransController',
            controllerAs: 'confirmDelTransModalVM',
            resolve: {
                params: function() {
                    return {
                        transId: transactionId
                    };
                }
            }
        });
        return modalInstance;
    }

    function _showConfirmRemoveLOB($uibModal, transactionId) {
        var modalInstance = $uibModal.open({
            templateUrl: '../scripts/services/platform/modal/templates/confirmRemoveLOBTemplate.html',
            controller: 'modalConfirmRemoveLOBController',
            controllerAs: 'confirmRemoveLOBModalVM',
            resolve: {
                params: function() {
                    return null;
                }
            }
        });
        return modalInstance;
    }

  function _showAddViewAttachments($uibModal, transactionId, attachmentTypes) {
    var modalInstance = $uibModal.open({
      templateUrl: '../scripts/services/platform/modal/attachments/attachments.component.html',
      controller: 'modalAddViewAttachments',
      controllerAs: 'attachmentsModalVM',
      resolve: {
        params: function() {
          return {
            transactionId: transactionId,
            attachmentTypes: attachmentTypes
          };
        }
      }
    });
    return modalInstance;
  }

    return ['$uibModal', '$log', function($uibModal, $log) {
        return {

            showSystemError: function(error) {
                return _showSystemError($uibModal, error);
            },

            showNotes: function(classId, classOrder, lob) {
                return _showNotes($uibModal, classId, classOrder, lob)
            },

            showConfirm: function() {
                return _showConfirm($uibModal)
            },

            showConfirmDeleteTransaction: function(transactionId) {
                return _showConfirmDeleteTransaction($uibModal, transactionId)
            },

            showConfirmRemoveLOB: function(transactionId) {
                return _showConfirmRemoveLOB($uibModal)
            },

            showAddViewAttachments: function(transactionId, attachmentTypes){
              return _showAddViewAttachments($uibModal, transactionId, attachmentTypes)
              //return _showConfirm($uibModal)
            }

        };
    }];
}
