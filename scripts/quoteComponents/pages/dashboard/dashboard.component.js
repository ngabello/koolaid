/**
 * Created by ngabelloa on 12/19/2016.
 */
'use strict';

function DashboardComponentCtrl() {

  function AssignDashboardData(dashboardVM, data) {
    dashboardVM.dashboardData = data;
    if(dashboardVM.dashboardData.ProducerEmail) {
      dashboardVM.mailLink = 'mailto:' + dashboardVM.dashboardData.ProducerEmail + '?subject=Transaction Number: ' +
        dashboardVM.dashboardData.SubmissionId + '/Account Name:' + dashboardVM.dashboardData.AccountName;
    }
  }

  return ['$log', '$rootScope', 'dashboardChangedEventService', 'DecisionModel', 'navigationService', 'ModalService', 'ErrorService', 'spinnerService', 'decisionService',
    function (logger, $rootScope, dashboardChangedEventService, decisionModel, navigationService, modalService, errorService, spinnerService, decisionService) {

      var dashboardVM = this;

      dashboardVM.isPublic = false;
      dashboardVM.tinymceModel = null;
      dashboardVM.tinymceOptions = {
        plugins: 'link image code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
        menubar: 'file edit format',
        browser_spellcheck: true,
        statusbar: false,
        format: 'text'
      };

      AssignDashboardData(dashboardVM, decisionModel.getDashboardInfo());

      //Load the attachment types for the specified user
      decisionService.getUserAttachmentTypes(dashboardVM.dashboardData.Id).then(function(result){
        if(result && result.hasOwnProperty('AttachmentTypes')){
          dashboardVM.attachmentTypes = result.AttachmentTypes;
        }
      });

      //Subscribe the a global event that is fired everytime the response object contains a property of dashboard
      dashboardChangedEventService.subscribe($rootScope, function dashboardChanged() {
        // Handle notification
        console.log('dashboard refreshed');
        AssignDashboardData(dashboardVM, decisionModel.getDashboardInfo());
      });

      dashboardVM.showPolicyNumber = function () {
        return !!(dashboardVM.dashboardData.PolicyNumber &&
        (EnumWorkFlowState.Bind == dashboardVM.dashboardData.TransactionState
        || dashboardVM.dashboardData.TransactionState == EnumWorkFlowState.PreIssue
        || dashboardVM.dashboardData.TransactionState == EnumWorkFlowState.Issued));
      };

      dashboardVM.newTransaction = function () {
        navigationService.goToAppStart();
      };

      dashboardVM.deleteTransaction = function () {
        var modalInstance = modalService.showConfirmDeleteTransaction(dashboardVM.dashboardData.SubmissionId);
        modalInstance.result.then(function (result) {
          if (result) {
            spinnerService.show('processingSpinner');
            decisionService.deleteTransaction(dashboardVM.dashboardData.Id).then(function (removeResult) {
              spinnerService.hide('processingSpinner');
              navigationService.goToAppStart();
            }, function (error) {
              errorService.showSystemError('DashboardComponentCtrl: removeClass call failed', error);
            });
          }
        }, function () {
          logger.error('DashboardComponentCtrl: deleteTransaction Confirm modal returned an error on result')
        });
      };

      dashboardVM.copy = function (copyType) {
        spinnerService.show('processingSpinner');
        decisionService.copyTransaction(dashboardVM.dashboardData.Id, copyType).then(function (copyResult) {
          dashboardVM.newTransactionId = copyResult.Id;
          decisionService.releaseTransaction(dashboardVM.dashboardData.Id).then(function (releaseResult) {
            decisionService.getAccountInformation(dashboardVM.newTransactionId).then(function (getAccountInfoResult) {
              spinnerService.hide('processingSpinner');
              navigationService.navigateTo({transactionId: dashboardVM.newTransactionId}, 'AccountInformation');
            }, function (error) {
              errorService.showSystemError('DashboardComponentCtrl: retrieving account information', error);
            });
          }, function (error) {
            errorService.showSystemError('DashboardComponentCtrl: releaseTransaction call failed', error);
          });
        }, function (error) {
          errorService.showSystemError('DashboardComponentCtrl: copyTransaction call failed', error);
        });
      };

      dashboardVM.clearNote = function () {
        dashboardVM.tinymceModel = null;
      };

      dashboardVM.saveNote = function () {
        spinnerService.show('processingSpinner');
          var noteRequest = {
            Id: dashboardVM.dashboardData.Id,
            IsPublicNote: dashboardVM.isPublic,
            NoteText: dashboardVM.tinymceModel
          };
        decisionService.saveNote(noteRequest).then(function (saveResult) {
          decisionService.getDashboard(dashboardVM.dashboardData.Id).then(function (getDashboardResult) {
            spinnerService.hide('processingSpinner');
            dashboardVM.tinymceModel = null;
            AssignDashboardData(dashboardVM, getDashboardResult);
          }, function (error) {
            errorService.showSystemError('DashboardComponentCtrl: retrieving account information', error);
          });
        }, function (error) {
          errorService.showSystemError('DashboardComponentCtrl: releaseTransaction call failed', error);
        });
      };

      dashboardVM.emailProducer = function(){
        $window.open("mailto:"+ emailId + "?subject=" + subject+"&body="+message,"_self");
      };

      dashboardVM.viewAttachments = function () {
        var modalInstance = modalService.showAddViewAttachments(dashboardVM.dashboardData.Id, dashboardVM.attachmentTypes);
        modalInstance.result.then(function (result) {
          if (result) {

          }
        }, function () {
          logger.error('DashboardComponentCtrl: deleteTransaction Confirm modal returned an error on result')
        });
      }

    }
  ];
}
