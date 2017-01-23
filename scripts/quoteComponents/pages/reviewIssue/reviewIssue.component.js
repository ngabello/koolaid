/**
 * Created by ngabelloa on 10/27/2016.
 */
'use strict';

function ReviewIssueComponentCtrl() {

  return ['$scope', 'spinnerService',
    function ($scope, spinnerService) {

      spinnerService.hideAll();

    }
  ];
}
