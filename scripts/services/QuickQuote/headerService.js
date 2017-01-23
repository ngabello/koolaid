/**
 * Created by ngabelloa on 11/9/2016.
 */
'use strict';

var headerDocument = {
  SSO_USER_NAME: 'jdennebaum',
    SSO_FIRSTNAME: 'Test',
    SSO_LASTNAME: 'Test',
    PRODUCER_CODE: 'P20110621A',
    SSO_AGENCY_CODE: 210657,
    SSO_AGENCY_NAME: 'Partners Specialty Group, LLC (210041)',
    SSO_IS_INTERNAL: true,
    SSO_IS_BROKERAGE: false,
    XUserName: 'QAUS\\ngabelloa',
    SSO_DEFAULT_STATE: 'VA',
    SSO_REGION: null,
  Allowed_Lobs: ['CPL']
};


function HeaderDocumentService() {
  return ['Constants', function (constants) {

    //This clears QuoteIntentId from the 'dataDocument' object
    this.getHeaderDocument = function () {
      if (headerDocument) {
        return headerDocument;
      }
    };

    this.getHeaderDefaultState = function () {
      if (headerDocument) {
        return headerDocument.SSO_DEFAULT_STATE;
      }
    };

    this.getHeaderAllowedLobs = function () {
      var allowedLobs = [];
      if (headerDocument) {
        angular.forEach(headerDocument.Allowed_Lobs, function(lobItem){
          if(constants.LineOfBusiness.hasOwnProperty(lobItem)){
            allowedLobs.push(constants.LineOfBusiness[lobItem]);
          }
        });
      }
      return allowedLobs;
    };

    this.getHeaderIsInternal = function () {
      if (headerDocument) {
        return headerDocument.SSO_IS_INTERNAL;
      }
    };
  }]
}
