/**
 * Created by ngabelloa on 10/27/2016.
 */
'use strict';

function CPLReviewBindComponentCtrl() {

  return ['spinnerService', '$state', '$stateParams', 'LookupDataService', 'deliveryService', 'ErrorService', 'PolicyModel', 'decisionService', 'Constants',
    '$timeout', 'ModalService', 'HeaderDocumentService', 'navigationService', '$http',
    function (spinnerService, $state, params, lookupData, deliveryService, errorService, policyModel, decisionService, constants,
      $timeout, modalService, headerDocumentService, navigationService, $http) {

      spinnerService.hideAll();
      if (!lookupData.hasLookups() || !params.transactionId) {
        navigationService.goToAppStart();
        return;
      }

      this.$onInit = function () {
        spinnerService.show('processingSpinner');

        decisionService.getBindImage(reviewBindVM.transactionId).then(function (getImageBytes) {
          reviewBindVM.downloadImagePath = getImageBytes;
          spinnerService.hide('processingSpinner');
        }, function (error) {
          errorService.showSystemError('Review Bind: getBindImage failed', error);
        });
      };

      var reviewBindVM = this;
      reviewBindVM.formSubmitted = false;
      reviewBindVM.policy = policyModel.getPolicy();
      reviewBindVM.transactionId = params.transactionId;
      reviewBindVM.isInternalUser = headerDocumentService.getHeaderIsInternal();
      //reviewBindVM.downloadImagePath  = "/QuickQuote/DownloadBindLetterPNG/" +  reviewBindVM.transactionId;

      reviewBindVM.continue = function (form) {
        reviewBindVM.formSubmitted = true;
        if (form.$valid) {
          spinnerService.show('processingSpinner');
          navigationService.getNextStep({ transactionId: reviewBindVM.transactionId });
        }
      };

      reviewBindVM.navigateBack = function (form) {
        reviewBindVM.formSubmitted = true;
        if (form.$valid) {

        }
      };

      reviewBindVM.savePolicy = function (form) {
        reviewBindVM.formSubmitted = true;
        if (form.$valid) {

        }
      };

      reviewBindVM.downloadDoc = function (form) {
        // $http.get('/api/reports/pdf', {responseType: 'arraybuffer'})
        // .success(function (data) {
        //  var file = new Blob([data], {type: 'application/pdf'});
        //   var fileURL = URL.createObjectURL(file);
        //  window.open(fileURL);
        // });
        decisionService.getBindDoc(reviewBindVM.transactionId).then(function (bindBytes) {
          var bytes = _base64ToArrayBuffer(bindBytes);
          var file1 = new Blob([bytes], { type: 'application/msword;base64' });
          var fileURL = URL.createObjectURL(file1);
          //window.open(fileURL);

          var a = document.createElement('a');
          a.href = fileURL;
          a.download = 'document_name.docx';
          a.target = '_blank';
          a.click();
        }, function (error) {
          errorService.showSystemError('Review Bind: getBindDoc failed', error);
        });

      };

      reviewBindVM.downloadLetter = function (form) {
        decisionService.getBindLetter(reviewBindVM.transactionId).then(function (bindBytes) {

          var bytes = _base64ToArrayBuffer(bindBytes);
          var blobData = new Blob([bytes], { type: 'application/pdf' });
          var fileURL = URL.createObjectURL(blobData);
          window.open(fileURL);
        }, function (error) {
          errorService.showSystemError('Review Bind: getBindLetter failed', error);
        });
      };

      function _base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
      }
    }
  ];
}

