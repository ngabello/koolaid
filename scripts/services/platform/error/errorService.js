/**
 * Created by ngabelloa on 11/15/2016.
 */
function ErrorService() {
  'use strict';

  return ['$log', 'spinnerService', 'ModalService',
    function ($log, spinnerService, modalService) {
      return {
        showSystemError: function(errorText, error){
          $log.error(errorText, error);
          spinnerService.hideAll();
          modalService.showSystemError(error);
        }
      }
    }
  ];
}
