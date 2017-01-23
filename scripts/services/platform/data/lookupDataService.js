/**
 * Created by ngabelloa on 11/3/2016.
 */
angular.module('platform.lookupDataService', [])
  .service('LookupDataService', ['$q', '$log', 'localStorageService',
    function ($q, $log, localStorage) {

      this.hasLookups = function () {
        var localLookups = localStorage.get('lookupData');
        return !!(localLookups && localLookups.length > 0);
      };

      this.saveLookupData = function (data) {
        var lookups = [];
        _.forEach(data, function (dataItem) {
          var enumObj = dataItem;
          lookups.push({name: enumObj.name, items: enumObj.items})
        });
        localStorage.set('lookupData', lookups);
      };

      this.getLookupItems = function (enumName) {
        var lookups = localStorage.get('lookupData');
        var lookupItems = _.findWhere(lookups, {name: enumName});
        if (lookupItems && lookupItems.items) {
          return _.sortBy(lookupItems.items, 'SortOrder');
        }
        return null;
      };
      //--------------- Lookup ----------------------------------------------------
      this.getSearchStatuses = function(){
        return this.getLookupItems('SearchStatus')
      };

      this.getSublineTypes = function(){
        return this.getLookupItems('SublineType')
      };

      this.getSearchTypes = function () {
        return this.getLookupItems('SearchType')
      };

      this.getMarkelSearchRegions = function () {
        return this.getLookupItems('MarkelSearchRegions')
      };

      /*-------------------Markel Regions Methods --------------------------*/
      this.getMarkelRegions = function () {
        return this.getLookupItems('MarkelRegions')
      };

      this.getRegionAmsCode = function(regionCode){
        var region = _.findWhere(this.getMarkelRegions(), { value: regionCode});
        if(region && region.meta && region.meta.regionAmsCode){
          return region.meta.regionAmsCode;
        }else {
          return null;
        }
      };

      // gets all the underwriters by regionId
      this.getUnderwriters = function (regionId) {
        var underwriters = this.getLookupItems('Underwriters');
          var filterdUnderwriters = _.map(underwriters, function(uw){
          if(uw.meta.regionId == regionId){
            return {desc: uw.desc, value: uw.value};
          }
        });
        return _.filter(filterdUnderwriters, function(item){
          return _.isObject(item);
        })
      };


      /*-------------------LimitSearch Methods --------------------------*/
      this.getLimitSearchFromTypes = function () {
        return this.getLookupItems('LimitSearchFrom');
      };

      this.getStates = function(){
        var states = this.getLookupItems("States");
        return _.sortBy(states, 'desc');
      };

      this.getRegionByState = function(stateAbbreviation){
        var stateItem = _.findWhere(this.getStates(), {value: stateAbbreviation});
        if(stateItem && stateItem.Meta){
          return {
            Id: stateItem.Meta.regionId,
            Code: stateItem.Meta.regionCode,
            Name: stateItem.Meta.regionName };
        }
      };

      /*----------------------OptionalCoverageTypes Methods ---------------------------*/
      this.getOptionalCoverageTypes = function(){
        return this.getLookupItems('OptionalCoverageTypes');
      };


      /*----------------------Document Section Methods ---------------------------*/
      this.getDocumentSections = function(){
        return this.getLookupItems('DocumentSections');
      };

      this.getQuestionTypes = function () {
        return this.getLookupItems('QuestionType')
      };
      
    }]);
