/**
 * Created by ngabelloa on 10/31/2016.
 */
'use strict';
function ModelHelperService() {

  return ['PolicyReferralRequestModel', 'PolicySearchRequestModel',
    function (policyReferralRequest, policySearchRequest) {
      return {

        getPolicyReferralRequest: function(){
          return new policyReferralRequest();
        },

        getPolicySearchRequest: function(){
          return new policySearchRequest();
        }
      }
    }];
}
