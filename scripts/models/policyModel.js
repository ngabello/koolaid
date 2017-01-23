/**
 * Created by ngabelloa on 11/17/2016.
 */
'use strict';

var policyDocument = {
  // Agency: null,
  // AgentBinderComments: null,
  // AgentQuoteComments: null,
  // BindLetterChangeComments: null,
  // BoundDate: null,
  // CalculatedDataEffectiveDate: null,
  // CarrierName: null,
   CfLine: null,
  // EffectiveDate: null,
  // ExpirationDate: null,
   GlLine: null,
  // HasBeenReferred: null,
  // HasMaterialChanges: null,
  // HasMultipleReferrals: null,
  // HomeState: null,
  // Id: null,
  // ImLine: null,
  // InternalAttachments: null,
  // IsAcceptedBindTerms: null,
  // IsActive: null,
  // IsAgentAvailable: null,
  // IsAgentComplete: null,
  // IsAgentCreated: null,
  // IsAssaultBattery: null,
  // IsBindingAgency: null,
  // IsBindLetterManuallyChanged: null,
  // IsBrokerageUser: null,
  // IsCorrectEffectiveDate: null,
  // IsDeleted: null,
  // IsExcludeTaxesFees: null,
  // IsFormerlyEssex: null,
  // IsInternal: null,
  // IsNew: null,
  // IsPolicyMarkelIssued: null,
  // IsQuoteLetterManuallyChanged: null,
  // IsReadOnly: null,
  // IsRenewal: null,
  // IsSameAsPrimaryRiskLocation: null,
  // IsTerrorism: null,
  // IsUnchangedRenewal: null,
  // IsUnderwriterComplete: null,
  // IsUnderwriterInitiated: null,
  // LastVisitedLine: null,
  // LastVisitedStep: null,
  // LetterTemplates: null,
  // LiquorLine: null,
  // LobOrder: null,
  // Messages: null,
  // MinimumEarnedPercentage: null,
  // MinPremiumTerrorism: null,
  // Notes: null,
  // OCPLine: null,
  // ParentPolicy: null,
  // PolicyDocumentErrorMessages: null,
  // PolicyDocumentName: null,
  // PolicyDocumentPath: null,
  // PolicyEdition: null,
  // PolicyModelVersion: null,
  // PolicyNumber: null,
  // PremiumTerrorism: null,
  // PrimaryInsured: null,
  // ProducerContact: null,
  // ProducerOfRecord: null,
  // Progress: null,
  // RetailerAgencyName: null,
  // RetailerContactName: null,
  // SecondaryInsured: null,
  // SpecialEventLine: null,
  // StateTransactionCode: null,
  // Subjectivities: null,
  // SubmissionNumber: null,
  // TaxesAndFees: null,
  // Term: null,
  // TotalAmountWithTaxes: null,
  // UnderwriterContact: null,
  // UnderwriterInternalComments: null,
  // UnderwriterOfRecord: null,
  // WorkflowState: null,
  // WorkingUserId: null,
  // WorkingUserName: null,
  // XsLine: null
};

function PolicyModelService() {

  return ['Constants', 'policyChangedEventService', function (constants, policyChangedEventService) {

    var dataDocument = angular.copy(policyDocument);
    var dmsData = {};
    var lineOfBusiness = {};

    this.init = function () {
      if (dataDocument) {
        dataDocument = angular.copy(policyDocument);
      }
    };

    this.getLineOfBusiness = function(){
      return this.lineOfBusiness;
    };

    this.saveLineOfBusiness = function(lineOfBusiness){
      this.lineOfBusiness = lineOfBusiness;
    };

    this.getPolicy = function(){
      return policyDocument;
    };

    this.updateDocuments = function(lob, documents){
      if(policyDocument[lob.ModelName] != null && policyDocument[lob.ModelName].RollUp != null)
          policyDocument[lob.ModelName].RollUp.Documents = documents;
    };

    this.updateCoverages = function(lob, coverages){
       if(policyDocument[lob.ModelName] != null && policyDocument[lob.ModelName].RollUp != null)
          policyDocument[lob.ModelName].RollUp.OptionalCoverages = coverages;
    };

    this.populateData = function (dataResult) {

      _.extend(policyDocument, dataResult);

      policyDocument.EffectiveDate = moment(dataResult.EffectiveDate).toDate();
      policyDocument.ExpirationDate = moment(dataResult.ExpirationDate).toDate();

      policyChangedEventService.notify();
    };
  }];
}
