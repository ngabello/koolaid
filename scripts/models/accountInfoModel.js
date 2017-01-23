/**
 * Created by ngabelloa on 1/16/2017.
 */
function AccountInfoModelService() {
  return ['DecisionModel', function (decisionModel) {
    var clazz = function (attributes) {
      var defaults = {
        "EffectiveDate": null,
        "ExpirationDate": null,
        "RegionCode": null,
        "RegionId": "00000000-0000-0000-0000-000000000000",
        "AgencyId": "00000000-0000-0000-0000-000000000000",
        "ProducerContact":null,
        "OnBehalfOfContact":null,
        "OnBehalfOfUnderwriter":null,
        "AgencyCode": null,
        "AgencyName": null,
        "AgencyAddress1": null,
        "AgencyAddress2": null,
        "AgencyState": null,
        "AgencyCity": null,
        "AgencyZipCode": null,
        "AccountName": null,
        "AccountAddress1": null,
        "AccountAddress2": null,
        "AccountCity": null,
        "AccountStateCode": null,
        "AccountZipCode": null,
        "LineOfBusiness": 0,
        "CreatedDate": null,
        "RenewalOfSubmissionNumber": null,
        "RenewalOfPolicyNumber": null,
        "HasMaterialChanges": null,
        "IsRenewal": false,
        "CanBeRenewal": true,
        "SecondaryAccountName": null,
        "SecondaryAccountAddress1": null,
        "SecondaryAccountAddress2": null,
        "SecondaryAccountCity": null,
        "SecondaryAccountStateCode": null,
        "SecondaryAccountZipCode": null,
        "IsSameAsPrimaryRiskLocation": false,
        "HideHasMaterialChangesQuestion": false,
        "HomeState": null,
        "Id": "00000000-0000-0000-0000-000000000000",
        "Progress": [{
          "Lob": null,
          "Step": 0,
          "Progress": 1
        }],
        "LobOrder": [{
          "Code": 0
        }],
        "IsReadOnly": false,
        "ReferState": 0,
        "ContinueState": 0,
        "TransactionState": 0,
        "Underwriter":null,
        "Messages": [],
        "LastModified": null,
        "LastModifiedByName": null,
        "IsIssuanceAllowed": true,
        "IsBindAllowed": true,
        "IsUnbindAllowed": true
      };
      _.extend(this, defaults, attributes);
    };
    // Class Methods
    _.extend(clazz.prototype, {

      save: function(){
        decisionModel.saveAccountInfo(this);
      },

      getPrefillData: function(){
        return {
          AmsId:null,
          Email:null,
          Name:null,
          Values:null
        }
      },

      populateData: function (data) {
        _.extend(this, data);

        if(!this.Underwriter){
          this.Underwriter = this.getPrefillData()
        }
        if(!this.ProducerContact){
          this.ProducerContact = this.getPrefillData()
        }
        if(!this.OnBehalfOfContact){
          this.OnBehalfOfContact = this.getPrefillData()
        }
        if(!this.OnBehalfOfUnderwriter){
          this.OnBehalfOfUnderwriter = this.getPrefillData()
        }

        if (data.EffectiveDate) {
          this.EffectiveDate = new Date(moment.utc(data.EffectiveDate, 'YYYY-MM-DD').format('MM/DD/YYYY', true));
        }

        if (data.ExpirationDate) {
          this.ExpirationDate = new Date(moment.utc(data.ExpirationDate, 'YYYY-MM-DD').format('MM/DD/YYYY', true));
        }
      }
    });

    return clazz;
  }];
}
