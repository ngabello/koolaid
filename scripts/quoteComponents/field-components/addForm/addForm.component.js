/**
 * Created by ngabelloa on 12/6/2016.
 */
'use strict';

function AddFormComponent() {

    function GetLineOfBusiness(constants, self) {
        var nextLineOfBusiness = _.find(constants.LineOfBusiness, function(lob) {
            return lob.SublineTypeId == self.sublineType;
        });
        return nextLineOfBusiness;
    }

    return {
        require: '^form',
        bindings: {
            lob: '<',
            policy: '=',
            documentAdded: '&'
        },
        templateUrl: '../scripts/quoteComponents/field-components/addForm/addForm.component.html',
        controller: ['decisionService', 'PolicyModel', function(deliveryService, policyModel) {

            var self = this;
            this.srchResults = [];
            this.formItem = null;
            this.submitted = false;
            this.addFormState = true;

            this.getDocuments = function(query) {
                return deliveryService.getSearchData(self.policy.Id, query, self.lob.Id).then(function(response) {
                    self.srchResults = response.Collection;
                    return self.srchResults;
                });
            };

            this.addSelectedForm = function(form, selectedItem) {
                if (selectedItem) {
                    form.formNameSearch.$setValidity('required', true);
                    deliveryService.addDocument(self.policy.Id, selectedItem.DocumentId, self.lob.Id, selectedItem.AddFormType).then(function(response) {
                        if (response.hasOwnProperty('Documents')) {
                            policyModel.updateDocuments(self.lob.Id, response.Documents);
                        }
                        if (response.hasOwnProperty('OptionalCoverages')) {
                            policyModel.updateCoverages(self.lob.Id, response.OptionalCoverages);
                        }
                        //Clear out the type ahead
                        self.formItem = null;
                        //call the parent documentAdded method
                        self.documentAdded({ documentId: selectedItem.DocumentId });
                    });
                } else {
                    form.formNameSearch.$setValidity('required', false);
                }
            };
        }]
    }
}