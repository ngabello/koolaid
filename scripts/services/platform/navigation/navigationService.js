/**
 * Created by ngabelloa on 12/21/2016.
 */
function NavigationService() {
  'use strict';

  var journeyStates = [];

  function GetLineOfBusiness(params, constants) {
    var lobId = params.lobId;
    return _.find(constants.LineOfBusiness, function (lob) {
      return lob.Id == lobId;
    });
  }

  function AddCoverageStates(lobs) {
    var coverageStates = [];
    angular.forEach(lobs, function (lob) {
      if (lob.Id === undefined || lob.Value === undefined) {
        return;
      }
      var lobId = lob.Id.toLowerCase();

      var stateItem = {
        template: 'root.quickQuote',
        url: '/' + lobId + '-CoverageSelection/:transactionId/:lobId',
        templateUrl: '../scripts/quoteComponents/pages/coverageSelection/' + lob.Name + '/' + lobId + 'CoverageSelection.component.html',
        controller: lob.Id + "CoverageSelectionComponentCtrl()",
        controllerAs: 'coverageVM',
        data: {
          lobId: lob.Id,
          pageName: "CoverageSelection",
          nextPage: "RatesPremiums",
          backPage: "AccountInfo"
        }
      };
      AddJourneyItem(stateItem);
    });
    return coverageStates;
  }

  function AddJourneyItem(journeyItem) {
    if (journeyItem.hasOwnProperty('data') && journeyItem.data.hasOwnProperty('lobId')) {
      journeyItem.name = journeyItem.template + '.' + journeyItem.data.lobId.toLowerCase() + '-' + journeyItem.data.pageName;
    } else if (journeyItem.hasOwnProperty('data')) {
      journeyItem.name = journeyItem.template + '.' + journeyItem.data.pageName;
    }
    journeyStates.push(journeyItem);
  }

  function FillJourneyStates(response, lobs) {
    if (!response || !response.data) {
      throw 'JourneyService: No Journey states found'
    }
    //AddCoverageStates(lobs);
    _.values(response.data).forEach(function (journeyItem) {
      AddJourneyItem(journeyItem, lobs);
    });
  }

  function FillJourneyRoutes(response, $state, journeyRouteService, lobs) {
    FillJourneyStates(response, lobs);

    var currentStates = $state.get();
    if (!currentStates) {
      throw 'JourneyService: No Routes found check the config';
    }
    //Before we add a new route make sure it does not already exist
    _.values(journeyStates).forEach(function (stateItem) {
      var existingState = _.findWhere(currentStates, {name: stateItem.name});
      if (!existingState && stateItem.templateUrl) {
        journeyRouteService.addState(stateItem);
      }
    });
  }

  function GetJson($http, pathToJson, $q) {
    return $q(function (res) {
      return $http.get(pathToJson).then(function (temp) {
        res(temp)
      });
    })
  }

  function getCurrentState($state) {
    var currentState = _.find(journeyStates, function (state) {
      if (state.hasOwnProperty('data')) {
        return state.name == $state.current.name;
      } else {
        return false;
      }
    });
    if (!currentState) {
      throw String.format('NavigationService: getNextStep no state found for {0}', $state.current.url);
    }
    return currentState;
  }

  return ['$q', '$log', '$state', '$stateParams', '$http', '$location', 'spinnerService', 'Constants', 'decisionService',
    'ErrorService', 'routeStateService', 'journeyRouteProvider', 'HeaderDocumentService',
    function ($q, $log, $state, params, $http, $location, spinnerService, constants, decisionService,
              errorService, routeStateService, journeyRouteProvider, headerDocumentService) {
      return {

        redirectJourney: function (route) {
          spinnerService.hideAll();
          $window.location.href = route;
        },

        goToAppStart: function () {
          spinnerService.hideAll();
          $state.go('root.ClassSearch');
        },

        //This would be great
        goToStepOne: function () {

        },

        terminateJourney: function (errorId) {
          spinnerService.hideAll();
        },

        loadFlowState: function (journeyPath) {
          var deferred = $q.defer();

          var getJourneyJsonPromise = GetJson($http, journeyPath, $q);
          $q.when(getJourneyJsonPromise).then(function (response) {
            FillJourneyRoutes(response, $state, journeyRouteProvider, headerDocumentService.getHeaderAllowedLobs());
            deferred.resolve();
          }, function (error) {
            deferred.reject(error);
          });
          return deferred.promise;
        },

        navigateTo: function (args, nextPage, params) {
          var nextState = _.find(journeyStates, function (state) {
            // If there is an lob in the args then find the state with pagename and lob
            if (state.hasOwnProperty('data') && args.hasOwnProperty('lobId') && state.data.hasOwnProperty('lobId')) {
              return state.data.pageName == nextPage && state.data.lobId == args.lobId
            }
            else if (state.hasOwnProperty('data')) {
              return state.data.pageName == nextPage;
            } else {
              return false;
            }
          });
          if (!nextState) {
            if (args.lobId) {
              errorService.showSystemError(String.format('JourneyService: there was no state defined for page {0}, lobId {1}', nextPage, args.lobId));
            } else {
              errorService.showSystemError(String.format('JourneyService: there was no state defined for page {0}', nextPage));
            }
          }
          $log.debug(String.format('NavigationService: getNextStep going to page {0}', nextState.name));

          spinnerService.hide('processingSpinner');
          if (params) {
            _.extend(args, params);
          }
          // transition to the next view
          $state.go(nextState.name, args);
        },

        getPreviousStep: function (args, params) {
          try {
            var currentState = getCurrentState($state);
            var nextPage = currentState.data.backPage;
            if (nextPage) {
              this.navigateTo(args, nextPage, params);
            } else {
              $log.error(String.format('JourneyService: navigating from {0} there was no nextPage defined', nextPage));
            }
          }
          catch (e) {
            $log.error('JourneyService: exception caught', e);
            //TODO we need to navigate to an error screen
          }
        },

        getNextStep: function (args, params) {
          try {
            var currentState = getCurrentState($state);
            var nextPage = currentState.data.nextPage;

            if (nextPage) {
              this.navigateTo(args, nextPage, params);
            } else {
              $log.error(String.format('JourneyService: navigating from {0} there was no nextPage defined', nextPage));
            }
          }
          catch (e) {
            $log.error('JourneyService: exception caught', e);
            //TODO we need to navigate to an error screen
          }
        }
      };
    }];
}
