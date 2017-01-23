/**
 * Created by ngabelloa on 1/16/2017.
 */

var decisionDocument = {
  AccountInfo: null,
  Dashboard : null

};

function DecisionModelService() {
  return [ function () {

    //---------------------- Account Info -------------------------------
    this.saveAccountInfo = function(accountInfoModel){
      decisionDocument.AccountInfo = accountInfoModel;
    };

    this.getAccountInfo = function(){
      return decisionDocument.AccountInfo;
    };

    //---------------------- Dashboard Info -------------------------------
    this.saveDashboardInfo = function(dashboardModel){
      decisionDocument.Dashboard = dashboardModel;
    };

    this.getDashboardInfo = function(){
      return decisionDocument.Dashboard;
    };








    this.populateData = function (dataResult) {
      _.extend(decisionDocument, dataResult.data);
    };

  }];
}
