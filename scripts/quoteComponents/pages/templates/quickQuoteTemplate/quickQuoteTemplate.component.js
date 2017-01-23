/**
 * Created by ngabelloa on 12/20/2016.
 */
'use strict';

function QuickQuoteTemplateCtrl() {

  return ['$log', '$state', '$stateParams', '$location', 'spinnerService', 'LookupDataService', 'deliveryService', 'ErrorService', 'PolicyModel', 'decisionService',
    function (logger, $state, params, $location, spinnerService, lookupData, deliveryService, errorService, policyModel, decisionService) {

      var quickQuoteVM = this;
      quickQuoteVM.transactionId = params.transactionId;
      quickQuoteVM.lob = params.lob;
      quickQuoteVM.policy = policyModel.getPolicy();


      this.navigateBack = function(form){

      };

      this.savePolicy = function(form){

      };

      this.continue = function(form){

      };
    }
  ];
}
