/**
 * Created by ngabelloa on 10/27/2016.
 */
'use strict';

function ReviewBindComponentCtrl() {

  return ['$scope', 'spinnerService',
    function ($scope, spinnerService) {

      spinnerService.hideAll();

    }
  ];
}
