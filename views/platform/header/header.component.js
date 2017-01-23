/**
 * Created by ngabelloa on 12/21/2016.
 */
'use strict';

function HeaderComponentCtrl() {

  return ['$log', 'HeaderDocumentService',
    function (logger, headerDocumentService) {

      var headerVM = this;
      headerVM.headerDocument = headerDocumentService.getHeaderDocument();

    }
  ];
}
