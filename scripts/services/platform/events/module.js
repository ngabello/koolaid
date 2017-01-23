/**
 * Created by ngabelloa on 12/20/2016.
 */
angular.module('platform.events', [])
  .factory('policyChangedEventService', PolicyChangedService())
  .factory('dashboardChangedEventService', DashboardChangedService());
