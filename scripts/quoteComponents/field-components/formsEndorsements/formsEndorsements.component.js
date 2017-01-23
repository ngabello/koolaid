/**
 * Created by ngabelloa on 12/6/2016.
 */
'use strict';
function FormsEndorsementsComponent() {
  return {
    require: '^form',
    bindings: {
      formGroups: '<',
      lob: '<',
      policy: '<',
      onUpdate: '&'
    },
    templateUrl: '../scripts/quoteComponents/field-components/formsEndorsements/formsEndorsements.component.html',
    controller: ['decisionService', 'HeaderDocumentService', 'PolicyModel', 'Constants',
      function (decisionService, headerDocumentService, policyModel, constants) {

        var self = this;
        self.isInternalUser = headerDocumentService.getHeaderIsInternal();

        self.valueChanged = function (service, answerValue, additionalParameters, isChecked) {
          var params = {
            AdditionalParameters: additionalParameters,
            Id: self.policy.Id,
            Value: answerValue,
            IsChecked: isChecked,
            Lob: self.lob.Value
          };

          self.onUpdate({ service: service, params: params });
        };

        self.$onChanges = function () {
          _.each(self.formGroups, function (formGroupItem) {
            _.each(formGroupItem.Forms, function (item) {
              item.IsEditable = self.returnIsEditable(item);
              item.IsSelected = self.returnIsSelected(item);
              item.IsLocked = self.showLocked(item);
              item.IsUnlocked = self.showUnlocked(item);
              item.IsConflicted = self.returnIsConflicted(item);
              //console.log(item.AttachmentModifiedBy,item.IsEditable, item.IsSelected, item.IsLocked, item.IsUnlocked, item.IsConflicted);
            });
          });
        }

        self.returnIsEditable = function (document) {
          if (document.AttachmentModifiedBy == null) {
            return false;
          }

          var maxAttachedBy = self.getMaxAttachedBy(document.AttachmentModifiedBy).AttachedBy;

          if (self.isInternalUser) {
            // editable if not modified by any level greater than underwriter and not mandatory with the only modifier equal to default
            if (maxAttachedBy <= constants.DocumentAttachedBy.Underwriter &&
              !(document.AttachmentType == constants.DocumentAttachmentType.Mandatory
                && maxAttachedBy == constants.DocumentAttachedBy.Default)) {
              return true;
            }
            else {
              return false;
            }
          }
          else {
            // if only modified by Agent or default and doc type is discretionary
            return document.AttachmentType == constants.DocumentAttachmentType.Discretionary
              && maxAttachedBy <= constants.DocumentAttachedBy.Agent;
          }
        }

        self.returnIsSelected = function (document) {
          // document.IsSelected || document.IsManuallyAdded
          if (document.AttachmentModifiedBy != null) {
            // return isAttached by highest modifier type available
            return self.getMaxAttachedBy(document.AttachmentModifiedBy).IsAttached;
          }

          return false;
        }

        self.returnIsConflicted = function (document) {
          var maxAttachedBy = self.getMaxAttachedBy(document.AttachmentModifiedBy).AttachedBy;

          if (maxAttachedBy == constants.DocumentAttachedBy.Underwriter
            && self.getAttachedBy(document.AttachmentModifiedBy, constants.DocumentAttachedBy.Rule) !== undefined) {
            return self.getAttachedBy(document.AttachmentModifiedBy, constants.DocumentAttachedBy.Underwriter).IsAttached
              != self.getAttachedBy(document.AttachmentModifiedBy, constants.DocumentAttachedBy.Rule).IsAttached;
          }

          return false;
        }

        self.showLocked = function (document) {
          // if attached by underwriter exist and is not equal to attached settings modified by rule or IsLocked is set
          var maxAttachedBy = self.getMaxAttachedBy(document.AttachmentModifiedBy).AttachedBy;

          return maxAttachedBy == constants.DocumentAttachedBy.Underwriter
            && !(self.getAttachedBy(document.AttachmentModifiedBy, constants.DocumentAttachedBy.Rule) !== undefined)
            && document.AttachmentType == constants.DocumentAttachmentType.Discretionary;
        }

        self.showUnlocked = function (document) {
          // if attached by nothing higher than agent and is discretionary
          var maxAttachedBy = self.getMaxAttachedBy(document.AttachmentModifiedBy).AttachedBy;

          return self.isInternalUser && maxAttachedBy == constants.DocumentAttachedBy.Rule
            && document.AttachmentType == constants.DocumentAttachmentType.Discretionary;
        }

        self.getMaxAttachedBy = function (attachmentModifiedBy) {
          return _.max(attachmentModifiedBy, function (item) {
            return item.AttachedBy;
          });
        }

        self.getAttachedBy = function (attachmentModifiedBy, attachedBy) {
          return _.find(attachmentModifiedBy, function (item) {
            return item.AttachedBy == attachedBy;
          });
        }

      }]
  }
}
