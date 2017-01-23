/**
 * Created by ngabelloa on 11/8/2016.
 */
angular.module('quickQuote.config', [])

.constant('userInfoConfig', {
        SSO_USER_NAME: 'bjoyce@210100_crcins.com',
        SSO_FIRSTNAME: 'Jim',
        SSO_LASTNAME: 'Sim',
        SSO_AGENCY_CODE: 210657,
        SSO_AGENCY_NAME: 'Partners Specialty Group, LLC (210041)',
        SSO_IS_INTERNAL: true,
        SSO_IS_BROKERAGE: false,
        XUserName: 'QAUS\\ngabelloa',
        SSO_DEFAULT_STATE: 'VA',
        SSO_REGION: null
    })
    .constant('Constants', {
        LineOfBusiness: {
            CPL: { Id: 'GL', Value: 0, Name: 'GeneralLiability', Desc: 'General Liability', SublineTypeId: 1, SublineType: 'GeneralLiability', DisplayType: 'text', ModelName: 'GlLine' },
            CF: { Id: 'CF', Value: 1, Name: 'Property', Desc: 'Property', SublineTypeId: 2, SublineType: 'Property', DisplayType: 'text', ModelName: 'CFLine' },
            XS: { Id: 'XS', Value: 2, Name: 'ExcessLiability', Desc: 'Excess Liability', SublineTypeId: 3, SublineType: 'ExcessLiability', DisplayType: 'text', ModelName: 'XSLine' },
            IM: { Id: 'IM', Value: 3, Name: 'InlandMarine', Desc: 'Inland Marine', SublineTypeId: 6, SublineType: 'InlandMarine', DisplayType: 'select', ModelName: 'ImLine' },
            OCP: { Id: 'OCP', Value: 4, Name: 'Ocp', Desc: 'OCP', SublineTypeId: 4, SublineType: 'OwnersContractsProtective', DisplayType: 'select', ModelName: 'GlLine' },
            LL: { Id: 'LL', Value: 5, Name: 'LiquorLiability', Desc: 'Liquor Liability', SublineTypeId: 5, SublineType: 'Liquor', DisplayType: 'select', ModelName: 'GlLine' },
            SpecialEvent: { Id: 'SpecialEvent', Value: 6, Name: 'SpecialEvent', Desc: 'Special Event', SublineTypeId: 7, SublineType: 'SpecialEvent', DisplayType: 'select', ModelName: 'SpecialEventLine' },
            //CPL: { Id: 'CPL', Value: 7, Name: 'contractorsPollutionLiability', Desc: 'CPL', SublineTypeId: 8, SublineType: 'ContractorsPollutionLiability', DisplayType: 'text', ModelName: 'GlLine' },
            None: { Id: 'None' }
        },
        TransactionStep: {
            ClassSearch: { Id: 0, Name: 'ClassSearch' },
            AccountInformation: { Id: 1, Name: 'AccountInformation' },
            CoverageSelection: { Id: 2, Name: 'CoverageSelection' },
            RatesPremiums: { Id: 3, Name: 'RatesPremiums' },
            AdditionalQuoteInformation: { Id: 4, Name: 'AdditionalQuoteInfo' },
            ReviewQuote: { Id: 5, Name: 'ReviewQuote' },
            AdditionalBindInformation: { Id: 6, Name: 'AdditionalBindInfo' },
            ReviewBind: { Id: 7, Name: 'Bind' },
            ReviewIssue: { Id: 8, Name: 'ReviewIssue' }
        },
        RateBasis: {
            Custom: 0,
            Unit: 1,
            Flat: 2,
            ClassPremium: 3,
            LinePremium: 4,
            LinePlusPremium: 5,
            PropertyTIV: 6,
            ExcessTerrorism: 7
        },
        DocumentAttachedBy: {
            Default: 0,
            Agent: 1,
            Rule: 2,
            Underwriter: 3,
            Definition: 4
        },
        DocumentAttachmentType: {
            Mandatory: 0,
            Conditional: 1,
            Discretionary: 2
        },
        Eligibility: {
            Agent: 0,
            Submit: 1,
            Prohibit: 2
        },
        MessageType: {
            Validation: 0,
            Submit: 1,
            Prohibit: 2,
            Info: 3,
            AgentRiskUnit: 4,
            SubmitRiskUnit: 5,
            ProhibitRiskUnit: 6
        },
        GuidelineType: { "C": "Risk Specific", "G": "General", "S": "Submit", "P": "Prohibit" }
        // PolicyResolve: function (lob) {
        //   return {
        //     policy: ['$stateParams', 'decisionService', function ($stateParams, decisionService) {
        //       return decisionService.getCoverageSelection($stateParams.transactionId, lob.Name).then(function (getCoverageResult) {

        //       }, function (error) {

        //       });
        //     }]
        //   }
        // }
    });