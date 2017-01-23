/**
 * Created by ngabelloa on 10/31/2016.
 */
'use strict';
function PolicyReferralRequestService() {

  return function () {
    var clazz = function (attributes) {
      var defaults = {
        AgencyCode: null,
        AgencyName: null,
        CountNotification: null,
        DeclinationReasons: null,
        IsUnderwriter: null,
        NumberOfPages: null,
        County: null,
        ID: null,
        PostalCode: null,
        State: null,
        IsValidated: null,
        PostalCodeType: null,
        HasRatedLocations: null
      };
      _.extend(this, defaults, attributes);
    };
    // Class Methods
    _.extend(clazz.prototype, {

      populateData: function (data) {
        _.extend(this, data);
      }
    });


    return clazz;
  };
}
