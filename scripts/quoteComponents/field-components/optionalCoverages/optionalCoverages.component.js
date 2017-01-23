/**
 * Created by ngabelloa on 12/6/2016.
 */
'use strict';
function OptionalCoveragesComponent() {
  return {
    require: '^form',
    bindings: {
      coverageGroups: '=',
      lob: '<',
      policy: '<',
      onUpdate: '&'
    },
    templateUrl: '../scripts/quoteComponents/field-components/optionalCoverages/optionalCoverages.component.html',
    controller: ['decisionService', 'HeaderDocumentService', 'PolicyModel', 'Constants', '$filter',
      function (decisionService, headerDocumentService, policyModel, constants, $filter) {

        var self = this;
        self.isInternalUser = headerDocumentService.getHeaderIsInternal();

        self.valueChanged = function (service, answerValue, additionalParameters) {
          var params = {
            AdditionalParameters: additionalParameters,
            Id: self.policy.Id,
            Value: answerValue,
            IsChecked: answerValue,
            Lob: self.lob.Value
          };

          self.onUpdate({ service: service, params: params });
        };

        self.optionalLimitOptions = function (limitOptions) {
          return _.chain(limitOptions.Limits).sortBy(function (o) { return o.LimitOptionDisplayOrder }).map(function (o) { return o.Text }).value().join("/");
        }

        self.optionalCoverageRateBasis = function (coverage) {
          if (coverage == undefined)
            return;

          var rate = coverage.Rate || 0;

          if (rate.LimitLevelId != null && coverage.LimitOptions.length > 0) {
            rate = _.find(coverage.LimitOptions, function (o) {
              return o.Id == coverage.LimitLevelId
            }).RateAmount;
          }

          var limitText = "<div class='list-wrap'> <ul id='customLimitText_" + coverage.Code + "'>";

          if (coverage.CustomLimitLevel != null) {
            limitText = "";
          }

          limitText += '</ul></div>';

          switch (coverage.Basis) {
            case constants.RateBasis.Custom:
              return coverage.CustomLimitLevel;
            case constants.RateBasis.Flat:
              return limitText + String.format("<span class='optionalCoverageRate'>{0} charge</span>", $filter('currency')(rate, undefined, 0));
            case constants.RateBasis.LinePremium:
            case constants.RateBasis.LinePlusPremium:
              var lineRateBasis = String.format("<span class='optionalCoverageRate'>{0}</span>% of {1} premium", rate * 100, GetLobString());

              if (coverage.MinimumPremium != null) {
                if (coverage.Code == "SETUP") {
                  lineRateBasis += " subject to a $50/per day minimum";
                }
                else {
                  lineRateBasis += String.format(" subject to a {0} minimum premium", $filter('currency')(coverage.MinimumPremium, undefined, 0));
                }
              }

              return limitText + lineRateBasis;
            case constants.RateBasis.ClassPremium:
              var classRateBasis = "";

              if (rate == 0) {
                classRateBasis = "<div class='rateBasis'><div class='noCharge'>No charge</div>";
              }
              else {
                classRateBasis = String.format("<div class='rateBasis'><div class='classPremium'><span class='optionalCoverageRate'>{0}</span>% of class premium", rate * 100);

                if (coverage.MinimumPremium != null) {
                  classRateBasis += String.format(" subject to a {0} minimum premium", $filter('currency')(coverage.MinimumPremium, undefined, 0));
                }

                classRateBasis += "</div></div>";
              }

              return limitText + classRateBasis;
            case constants.RateBasis.Unit:
              return limitText + String.format("<span class='optionalCoverageRate'>{0}</span> Each", $filter('currency')(rate, undefined, 0));
            case constants.RateBasis.PropertyTIV:
              var tivRateBasis = String.format("<span class='optionalCoverageRate'>{0}</span>% of TIV/100", rate * 100, undefined, 0);
              if (coverage.MinimumPremium != null) {
                tivRateBasis += String.format(" subject to a {0} minimum premium", $filter('currency')(coverage.MinimumPremium, undefined, 0));
              }

              return limitText + tivRateBasis;
            case constants.RateBasis.ExcessTerrorism:
              return String.format("{0} per million", $filter('currency')(coverage.Rate, undefined, 0));
            default:
              return ""
          }
        };

        self.isUnitBasisType = function (coverageBasis) {
          return coverageBasis == constants.RateBasis.Unit;
        }

        function GetLobString() {
          switch (self.lob.Id) {
            case "CF":
              return "Property";
            case "GL":
            case "SpecialEvent":
              return "GL";
            case "LL":
              return "Liquor";
            case "OCP":
              return "OCP";
            default:
              return "";
          }
        }
      }]
  }
}
