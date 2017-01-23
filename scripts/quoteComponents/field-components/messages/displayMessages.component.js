
'use strict';
function DisplayMessagesComponent() {
  return {
    require: '^form',
    bindings: {
      messages: '<',
      fieldName: '<'
    },
    templateUrl: '../scripts/quoteComponents/field-components/messages/displayMessages.component.html',
    controller: ['decisionService', 'HeaderDocumentService', 'PolicyModel', 'Constants', '$filter',
      function (decisionService, headerDocumentService, policyModel, constants, $filter) {

        var self = this;
        self.isInternalUser = headerDocumentService.getHeaderIsInternal();

        self.$onInit = function () {

          self.eligibilityMessage = _.find(self.messages, function (item) {
            return (self.isInternalUser == null
              || item.IsInternal == null
              || item.IsInternal == self.isInternalUser) && item.RelatedField == self.fieldName
              && item.MessageType != constants.MessageType.Validation;
          });

        };

        self.getClass = function (message) {
          if (message.MessageType == constants.MessageType.AgentRiskUnit || message.MessageType == constants.MessageType.SubmitRiskUnit || message.MessageType == constants.MessageType.ProhibitRiskUnit) {
            return "authority-messaging";
          }
          else if (message.MessageType == constants.MessageType.Prohibit) {
            return "authority-field-details prohibit"
          }
          else if (message.MessageType == constants.MessageType.Submit) {
            return "authority-field-details submit";
          }
          else {
            return "authority-field-details";
          }
        };

      }]
  }
}
