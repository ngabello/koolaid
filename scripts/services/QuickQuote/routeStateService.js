/**
 * Created by ngabelloa on 12/13/2016.
 */
function RouteStateService() {
  'use strict';

  return ['$state', 'Constants', function ($state, constants) {
    return {

      getRouteName: function (lob, transactionStep) {
        var stateName = '';
        //get all the routes
        var currentStates = $state.get();

        //get only the states that have an lob and transactionStep in the route data
        var coverageStates = _.filter(currentStates, function (stateItem) {
          if (transactionStep) {
            return stateItem.hasOwnProperty('data') && stateItem.data.hasOwnProperty('lob') && stateItem.data.hasOwnProperty(('transactionStep'));
          } else {
            return stateItem.hasOwnProperty('data') && stateItem.data.hasOwnProperty('lob');
          }
        });
        if (!coverageStates) {
          throw String.format('LineOfBusinessStateService: No states found check the config for LOB identifier {0} or TransactionStep {1}', lob.Id, transactionStep);
        }

        //get the route with the transactionStep = CoverageSelection and LobId
        var desiredState = _.find(coverageStates, function (covState) {
          if (transactionStep) {
            return covState.data.lob.Id == lob.Id && covState.data.transactionStep == transactionStep;
          } else {
            return covState.data.lob.Id == lob.Id;
          }
        });

        if (desiredState) {
          stateName = desiredState.name;
        }
        if (!desiredState) {
          throw String.format('LineOfBusinessStateService: getRouteByTransaction Could not find state for TransactionStep {0}', transactionStep);
        }

        return stateName;
      }, //getRouteName

      getRouteByTransactionStep: function (transactionStep) {
        var stateName = '';
        //get all the routes
        var currentStates = $state.get();

        //get only the states that have an lob and transactionStep in the route data
        var coverageStates = _.filter(currentStates, function (stateItem) {
          return stateItem.hasOwnProperty('data') && stateItem.data.hasOwnProperty(('transactionStep'));
        });
        if (!coverageStates) {
          throw String.format('LineOfBusinessStateService: getRouteByTransaction No states found check the config for TransactionStep {0}', transactionStep);
        }

        //get the route with the transactionStep = CoverageSelection and LobId
        var desiredState = _.find(coverageStates, function (covState) {
          return covState.data.transactionStep == transactionStep;
        });

        if (desiredState) {
          stateName = desiredState.name;
        }
        if (!desiredState) {
          throw String.format('LineOfBusinessStateService: getRouteByTransaction Could not find state for TransactionStep {1}', transactionStep);
        }

        return stateName;
      } //getRouteByTransactionStep
    }
  }];
}
