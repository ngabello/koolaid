/**
 * Created by ngabelloa on 12/21/2016.
 */
'use strict';
angular.module('platform.journeyNavigation', ['ui.router'])
  .factory('navigationService', NavigationService())
  .provider('journeyRouteProvider', ['$stateProvider', function ($stateProvider) {
    this.$get = function () {
      return {
        addState: function (stateItem) {
          $stateProvider.state(stateItem.name, {
            url: stateItem.url,
            templateUrl: stateItem.templateUrl,
            controller: eval(stateItem.controller),
            controllerAs: stateItem.controllerAs,
            data: stateItem.data,
            params: stateItem.params
          });
        }
      }
    }
  }])
;
