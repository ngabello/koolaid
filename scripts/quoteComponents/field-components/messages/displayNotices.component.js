
'use strict';
function DisplayNoticesComponent() {
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

          self.validMessages = _.find(self.messages, function (item) {
            return item.RelatedField == self.fieldName;
          });

        };

      }]
  }
}
