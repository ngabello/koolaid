/**
 * Created by ngabelloa on 1/16/2017.
 */
function DashboardModelService() {
  return ['$rootScope', 'DecisionModel', 'dashboardChangedEventService','policyChangedEventService',
    function ($rootScope, decisionModel, dashboardChangedEventService, policyChangedEventService) {
    var clazz = function (attributes) {
      var defaults = {
        "Id": null,
        "SubmissionId": null,
        "PolicyEffectiveDate": null,
        "PolicyExpirationDate": null,
        "AccountName": null,
        "AgencyName": null,
        "Contact": null,
        "ProducerEmail": null,
        "PolicyAuthority": null,
        "TotalPremium": null,
        "IsSuppressTotalPremium": null,
        "LobOrder": [],
        "ReferralReasons": [],
        "AttachedFiles": [],
        "IsInternal": null,
        "IsReadOnly": null,
        "TransactionState": null,
        "QuoteStatus": "Agent",
        "HasBeenReferred": false,
        "InternalNotes": null,
        "InternalNotesList": [],
        "UnderwriterToAgentNotes": null,
        "AgentToUnderwriterNotes": null,
        "Progress": [],
        "IsUnderwriterInitiated": null,
        "LastVisitedStep": null,
        "CanBeRenewed": null,
        "IsRenewal": null,
        "PolicyNumber": null,
        "InternalAttachmentsCount": null,
        "DataPullEffectiveDate": null
      };
      _.extend(this, defaults, attributes);
    };
    // Class Methods
    _.extend(clazz.prototype, {

      save: function(){
        decisionModel.saveDashboardInfo(this);
        dashboardChangedEventService.notify();
      },

      populateData: function (data) {
        _.extend(this, data);
      }
    });

    return clazz;
  }];
}
