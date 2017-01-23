/**
 * Created by ngabelloa on 10/28/2016.
 */
'use strict';

function DecisionService() {

  function saveDashboard(result, dashBoardModel) {
    if (result.hasOwnProperty('Dashboard')) {
      if(result.Dashboard && result.Dashboard.Id) {
        var dashboard = new dashBoardModel();
        dashboard.populateData(result.Dashboard);
        dashboard.save();
      }
    }
  }

    return ['$q', '$log', 'decisionApiService', 'PolicyModel', 'Constants', 'AccountInfoModel', 'DashboardModel',
        function($q, $log, decisionApiService, policyModel, constants, accountInfoModel, dashBoardModel) {

            var timeoutInMilliseconds = 60000;

            this.getTimeout = function() {
                return timeoutInMilliseconds;
            };

            //Get -- http://localhost:47776/api/GuidelinesNotes/5a976ff6-86d5-41c0-9582-39db7bcabe5b?classOrder=2&lob=GL
            this.getGuidelinesNotes = function(classId, classOrder, lob) {
                var params = { "classOrder": classOrder, "lob": lob };
                return this.getData(String.format('GuidelinesNotes/{0}', classId), params);
            };

      //********************** Account Info methods ----------------------------------------------
      //Get -- http://localhost:47776/api/AccountInformation/Get/98e21a6e-3fc3-403d-869b-39db8a22a966
      this.getAccountInformation = function (transactionId) {
        var deferred = $q.defer();
        var params = null;
        this.getData(String.format('AccountInformation/Get/{0}', transactionId), params).then(function (result) {
          var accountInfo = new accountInfoModel();
          accountInfo.populateData(result);
          accountInfo.save();
          deferred.resolve();
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };

      //Post -- http://localhost:47776/api/AccountInformation/Save
      this.saveAccountInfo = function (requestData) {
        var apiMethod = 'AccountInformation/Save';
        return this.postData(apiMethod, requestData);
      };

      //Get --http://localhost:47776/api/Policy/BindImage/fb6f025c-ad12-4d34-8576-39dca9faa41e
      this.getBindImage = function (transactionId) {
        var params = null;
        return this.getBlobData(String.format('Policy/BindImage/{0}', transactionId), params, 'blob');
      };

      //Get --http://localhost:47776/api/Policy/BindLetter/fb6f025c-ad12-4d34-8576-39dca9faa41e
      this.getBindLetter = function (transactionId) {
        var params = null;
        return this.getBlobData(String.format('Policy/BindLetter/{0}', transactionId), params, 'arraybuffer');
      };

      //Get --http://localhost:47776/api/Policy/BindDoc/fb6f025c-ad12-4d34-8576-39dca9faa41e
      this.getBindDoc = function (fileName) {
        var params = null;
        return this.getBlobData(String.format('Policy/BindDoc/{0}', fileName), params, 'arraybuffer');
      };


      //Get --http://localhost:47776/api/Policy/BindLetter/fb6f025c-ad12-4d34-8576-39dca9faa41e
      this.getPolicyById = function (transactionId) {
        var params = null;
        return this.getData(String.format('Policy/{0}', transactionId), params);
      };

      //POST -- http://localhost:47776/api/UpdateTransactionField/EffectiveDate
      this.updateTransactionField = function (transactionId, fieldName, value) {
        var deferred = $q.defer();
        var apiMethod = String.format('UpdateTransactionField/{0}', fieldName);
        var requestData = {
          Id: transactionId,
          Value: value
        };
        this.postData(apiMethod, requestData).then(function (result) {
          deferred.resolve();
        }, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };

      //Post -- http://localhost:47776/api/{lob name}/AddClass
      this.addClass = function (lobName, requestData) {
        var apiMethod = String.format('{0}/AddClass', lobName);
        return this.postData(apiMethod, requestData);
      };

      //Post -- http://localhost:47776/api/Policy/Validate/02533776-c264-47b4-b550-39db9ea84a0f?step=AccountInformation&lob=
      this.validatePolicy = function (transactionId, step, lobId) {
        if (!lobId) {
          return $q.when([]);
        }
        var params = {"step": step, "lob": lobId};
        var apiMethod = String.format('Policy/Validate/{0}', transactionId);
        return this.postData(apiMethod, null, params);
      };

      //Get -- http://localhost:47776/api/GeneralLiability/CoverageSelection?id=02533776-c264-47b4-b550-39db9ea84a0f
      this.getCoverageSelection = function (transactionId, lobName) {
        //This is because the route for Property is different than the other lines (weird right!)
        if (lobName == constants.LineOfBusiness.CF.Name) {
          return this.getPolicy(String.format('{0}/CoverageSelection/{1}', lobName, transactionId));
        } else {
          var params = {
            id: transactionId
          };
          return this.getPolicy(String.format('{0}/CoverageSelection', lobName), params);
        }
      };

      //POST http://stapp720:47000/api/SaveNote
      this.saveNote = function(noteRequest){
        var apiMethod = 'SaveNote';
        return this.postData(apiMethod, noteRequest);
      };

      //GET http://stapp720:47000/api/Policy/Dashboard/863fd9ae-7cd8-4089-8272-39dcc598bb4a
      this.getDashboard = function(transactionId){
        var apiMethod = String.format('Policy/Dashboard/{0}', transactionId);
        return this.getData(apiMethod);
      };

      //POST http://localhost:47776/api/Policy/RemoveLineOfBusiness/bd330dc4-5bba-44c3-9f65-39dba0243f8f?lob=OCP
      this.removeLineOfBusiness = function (transactionId, lobId) {
        var apiMethod = String.format('Policy/RemoveLineOfBusiness/{0}', transactionId);
        var params = {
          lob: lobId
        };
        return this.postData(apiMethod, null, params);
      };

      //GET http://localhost:47776/api/Policy/LineOfBusinessSelection/bd330dc4-5bba-44c3-9f65-39dba0243f8f
      this.lobSelection = function (transactionId) {
        var apiMethod = String.format('Policy/LineOfBusinessSelection/{0}', transactionId);
        return this.getPolicy(apiMethod);
      };

      this.getUserAttachmentTypes = function (transactionId) {
        var apiMethod = String.format('Policy/GetInternalAttachments/{0}', transactionId);
        return this.getData(apiMethod);
      };

      //Post - http://localhost:47776/api/Policy/AddLineOfBusiness/74690120-2197-4d34-8b72-39dbbe114d19?lob=CF
      this.addLineOfBusiness = function (transactionId, lobId) {
        var apiMethod = String.format('Policy/AddLineOfBusiness/{0}', transactionId);
        var params = {
          lob: lobId
        };
        return this.postData(apiMethod, null, params);
      };

      //POST http://localhost:47776/api/GeneralLiability/RemoveRiskUnit
      this.removeRiskUnit = function (lob, removeCriteria) {
        var apiMethod = String.format('{0}/RemoveRiskUnit', lob);
        return this.postData(apiMethod, removeCriteria);
      };

      //POST http://localhost:47776/api/OptionalCoverages
      this.updateOptionalCoverages = function (requestCriteria) {
        var apiMethod = 'OptionalCoverages';
        return this.postData(apiMethod, requestCriteria);
      };

      //Manage Document methods
      //GET http://localhost:47776/api/Policy/DocumentSearch/15ebf063-d462-4471-9325-39dbe6da58d0?query=war&lob=GL
      this.getSearchData = function (transactionId, query, lob) {
        var apiMethod = String.format('Policy/DocumentSearch/{0}', transactionId);
        var params = {
          query: query,
          lob: lob
        };
        return this.getData(apiMethod, params);
      };

      //POST http://localhost:47776/api/AddDocument/15ebf063-d462-4471-9325-39dbe6da58d0?documentId=3f2b8f35-dd97-4535-94a9-39d5e35b728f&lob=GL&addType=0
      this.addDocument = function (transactionId, documentId, lob, addFormType) {
        var apiMethod = String.format('AddDocument/{0}', transactionId);
        var params = {
          documentId: documentId,
          lob: lob,
          addType: addFormType
        };
        return this.postData(apiMethod, null, params);
      };

      this.updateField = function (service, params) {
        return this.postData(service, params);
      };

      //TODO: these api's need to be consolidated it makes no sense to have separate api calls to get RatesPremiums
      //especially for each LOB
      //***********************************************************************************
      //GET http://localhost:47776/api/GeneralLiability/GetRatesPremiums/3032003f-67e1-4c7f-b859-39dbf67c4eb1
      this.getGLRatesPremiums = function (transactionId) {
        var apiMethod = String.format('GeneralLiability/GetRatesPremiums/{0}', transactionId);
        return this.getPolicy(apiMethod);
      };
      //GET http://localhost:47776/api/Property/RatesPremiums/e7466470-0ad0-45ed-8d75-39dc7c23a22d
      this.getPropertyRatesPremiums = function (transactionId) {
        var apiMethod = String.format('Property/RatesPremiums/{0}', transactionId);
        return this.getPolicy(apiMethod);
      };
      //***********************************************************************************

      //GET http://localhost:47776/api/ReviewQuote/7b96d8ea-8885-4d3e-a08d-39dc82c3b6bf
      this.getReviewQuote = function (transactionId) {
        var params = null;
        return this.getPolicy(String.format('ReviewQuote/{0}', transactionId), params);
      };

      //Post http://localhost:47776/api/Policy/Save/5e5fb700-6295-4629-9059-39dc06049a52?step=CoverageSelection
      this.savePolicy = function (transactionId, step) {
        var apiMethod = String.format('Policy/Save/{0}', transactionId);
        var params = {
          step: step
        };
        return this.postData(apiMethod, null, params);
      };

      //******************************** Transaction Methods ******************************************************
      //DELETE http://stapp720:47000/api/Policy/Remove/cc47858f-2b87-4013-a425-39dcc468b19e
      this.deleteTransaction = function (transactionId) {
        var deferred = $q.defer();
        decisionApiService.one('Policy').one('Remove', transactionId).withHttpConfig({timeout: this.getTimeout()}).remove().then(function (result) {
            deferred.resolve(result);
          },
          function (error) {
            deferred.reject(error);
            $log.error(String.format('DecisionService: deleteTransaction - failed removing {0}', transactionId), error);
          });
        return deferred.promise;
      };

      //POST http://stapp720:47000/api/Policy/Copy?id=b052ea0a-dda9-4b1d-b807-39dcc55b74d6&copyType=SimilarRisk
      this.copyTransaction = function (transactionId, copyType) {
        var apiMethod = 'Policy/Copy';
        var params = {
          id: transactionId,
          copyType: copyType
        };
        return this.postData(apiMethod, null, params);
      };

      //PUT http://stapp720:47000/api/Policy/Release/b052ea0a-dda9-4b1d-b807-39dcc55b74d6
      this.releaseTransaction = function (transactionId) {
        var apiMethod = String.format('Policy/Release/{0}', transactionId);
        return this.putData(apiMethod);
      };

      this.putTransactionLock = function (transactionId) {
        var apiMethod = String.format('Policy/Lock/{0}', transactionId);
        var requestData = null;
        return this.putData(apiMethod)
      };
      //******************************** End Transaction Methods ******************************************************

      this.getData = function (apiMethod, params) {
        var urlCall;
        var newResDeferred = $q.defer();
        var deferred;

        if (params) {
          urlCall = String.format('{0}/{1}?{2}', decisionApiService.configuration.baseUrl, apiMethod, JSON.stringify(params));
          deferred = decisionApiService.one(apiMethod).withHttpConfig({timeout: this.getTimeout()}).get(params);
        } else {
          urlCall = String.format('{0}/{1}', decisionApiService.configuration.baseUrl, apiMethod);
          deferred = decisionApiService.one(apiMethod).withHttpConfig({timeout: this.getTimeout()}).get();
        }
        $q.when(deferred, function (result) {
          if (!_.isObject(result.data)) {
            newResDeferred.reject('DecisionService: getData failed, response data is null');
            $log.error(String.format('DecisionService: getData - completed calling {0} , response data is null', urlCall), error);
          } else {
            saveDashboard(result.data, dashBoardModel);
            newResDeferred.resolve(result.data.plain());
          }
        }, function (error) {
          newResDeferred.reject(error);
          $log.error(String.format('DecisionService: getData - failed calling {0}', urlCall), error);
        });
        return newResDeferred.promise;
      };


      this.postData = function (apiMethod, requestData, params) {
        var urlCall;
        var newResDeferred = $q.defer();
        var deferred;

        if (params) {
          urlCall = String.format('{0}/{1}?{2}', decisionApiService.configuration.baseUrl, apiMethod, JSON.stringify(params));
          deferred = decisionApiService.one(apiMethod).withHttpConfig({timeout: this.getTimeout()}).post('', requestData, params);
        } else {
          urlCall = String.format('{0}/{1}', decisionApiService.configuration.baseUrl, apiMethod);
          deferred = decisionApiService.one(apiMethod).withHttpConfig({timeout: this.getTimeout()}).post('', requestData);
        }
        $q.when(deferred, function (result) {
          if (!_.isObject(result.data)) {
            newResDeferred.reject('DecisionService: postData failed, response data is null');
            $log.error(String.format('DecisionService: postData - completed calling {0} , response data is null', urlCall));
          } else {
            saveDashboard(result.data, dashBoardModel);
            newResDeferred.resolve(result.data.plain());
          }
        }, function (error) {
          newResDeferred.reject(error);
          $log.error(String.format('DecisionService: postData - failed calling {0}', urlCall), error);
        });
        return newResDeferred.promise;
      };

      this.putData = function (apiMethod, requestData, params) {
        var urlCall;
        var newResDeferred = $q.defer();
        var deferred;

        if (params) {
          urlCall = String.format('{0}/{1}?{2}', decisionApiService.configuration.baseUrl, apiMethod, JSON.stringify(params));
          deferred = decisionApiService.one(apiMethod).withHttpConfig({timeout: this.getTimeout()}).put('', requestData, params);
        } else {
          urlCall = String.format('{0}/{1}', decisionApiService.configuration.baseUrl, apiMethod);
          deferred = decisionApiService.one(apiMethod).withHttpConfig({timeout: this.getTimeout()}).put('', requestData);
          var fun = decisionApiService;
        }
        $q.when(deferred, function (result) {
          if(result && result.data){
            saveDashboard(result.data, dashBoardModel);
            newResDeferred.resolve(result.data.plain());
          }else{
            newResDeferred.resolve();
          }
        }, function (error) {
          newResDeferred.reject(error);
          $log.error(String.format('DecisionService: putData - failed calling {0}', urlCall), error);
        });
        return newResDeferred.promise;
      };

      this.getPolicy = function (apiMethod, params) {
        var urlCall;
        var newResDeferred = $q.defer();
        var deferred;

        if (params) {
          urlCall = String.format('{0}/{1}?{2}', decisionApiService.configuration.baseUrl, apiMethod, JSON.stringify(params));
          deferred = decisionApiService.one(apiMethod).withHttpConfig({timeout: this.getTimeout()}).get(params);
        } else {
          urlCall = String.format('{0}/{1}', decisionApiService.configuration.baseUrl, apiMethod);
          deferred = decisionApiService.one(apiMethod).withHttpConfig({timeout: this.getTimeout()}).get();
        }
        $q.when(deferred, function (result) {
          if (!_.isObject(result.data)) {
            newResDeferred.reject('DecisionService: getData failed, response data is null');
            $log.error(String.format('DecisionService: getData - completed calling {0} , response data is null', urlCall), error);
          } else {
            policyModel.populateData(result.data.plain());
            saveDashboard(result.data, dashBoardModel);
            newResDeferred.resolve(result.data.plain());
          }
        }, function (error) {
          newResDeferred.reject(error);
          $log.error(String.format('DecisionService: getData - failed calling {0}', urlCall), error);
        });
        return newResDeferred.promise;
      };

      this.getBlobData = function (apiMethod, params, respType) {
        var urlCall;
        var newResDeferred = $q.defer();
        var deferred;

        if (params) {
          urlCall = String.format('{0}/{1}?{2}', decisionApiService.configuration.baseUrl, apiMethod, JSON.stringify(params));
          deferred = decisionApiService.one(apiMethod).withHttpConfig({timeout: this.getTimeout()}, {responseType: respType}).get(params);
        } else {
          urlCall = String.format('{0}/{1}', decisionApiService.configuration.baseUrl, apiMethod);
          deferred = decisionApiService.one(apiMethod).withHttpConfig({timeout: this.getTimeout()}, {responseType: respType}).get();
        }
        $q.when(deferred, function (result) {
          if (!_.isObject(result)) {
            newResDeferred.reject('DecisionService: getBlobData failed, response data is null');
            $log.error(String.format('DecisionService: getBlobData - completed calling {0} , response data is null', urlCall), error);
          } else {
            newResDeferred.resolve(result.data);
          }
        }, function (error) {
          newResDeferred.reject(error);
          $log.error(String.format('DecisionService: getBlobData - failed calling {0}', urlCall), error);
        });
        return newResDeferred.promise;
      };


      this.getTransactionData = function (api, request) {
        var deferred = $q.defer();
        var urlCall = String.format('{0}/{1}?{2}', decisionApiService.configuration.baseUrl, 'Policy/' + api, JSON.stringify(request));
        var api = decisionApiService.one('Policy').one(api).withHttpConfig({timeout: this.getTimeout()}).post('', request)
          .then(function (result) {
            if (!_.isObject(result.data)) {
              deferred.reject('DecisionService: getReferralData failed, response data is null');
              $log.error(String.format('DecisionService: getReferralData - completed calling {0} , response data is null', urlCall), error);
            } else {
              var searchResults = [];
              if (result.data.hasOwnProperty('Policies')) {
                deferred.resolve(result.data.plain());
              } else {
                deferred.reject('DecisionService: getReferralData failed, response data policies is null');
                $log.error(String.format('DecisionService: getReferralData - completed calling {0}, response data policies is null', urlCall), error);
              }
            }
          }, function (error) {
            deferred.reject(error);
            $log.error(String.format('DecisionService: getReferralData - failed calling {0}', urlCall), error);
          });
        return deferred.promise;
      };

    }];
}
