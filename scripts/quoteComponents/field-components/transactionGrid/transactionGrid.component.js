/**
 * Created by ngabelloa on 11/2/2016.
 */
function GetInitialReferralRequest(modelHelper, userData) {
  var referralRequest = modelHelper.getPolicyReferralRequest();
  referralRequest.AgencyCode = userData.SSO_AGENCY_CODE;
  referralRequest.AgencyName = userData.SSO_AGENCY_NAME;
  referralRequest.IsUnderwriter = userData.SSO_IS_INTERNAL;
  referralRequest.NumberOfPages = 1;
  referralRequest.TotalCount = 0;
  referralRequest.UserName = userData.SSO_USER_NAME;
  referralRequest.SortProperty = null;
  return referralRequest;
}

function ShowSearchControls(searchCategoryItem) {
  switch (searchCategoryItem) {
    case '1':     
      this.showStatuses = true;
      this.showContains = false;
      this.showLimitTime = true;
      this.showLimitScope = true;
      this.showDateRange = false;
      this.showIs = false;
      break;
    case '6':
      this.showStatuses = false;
      this.showIs = true;
      this.showContains = false;
      this.showLimitTime = true;
      this.showLimitScope = true;
      this.showDateRange = false;   
    case '2':
    case '9':
      this.showIs = false;
      this.showContains = true;
      this.showLimitTime = true;
      this.showLimitScope = true;
      this.showDateRange = false;
      this.showStatuses = false;
      break;
    case '0':
    case '7':
      this.showIs = true;
      this.showContains = false;
      this.showLimitTime = false;
      this.showLimitScope = false;
      this.showDateRange = false;
      this.showStatuses = false;
      break;
    case '3':
      this.showIs = false;
      this.showContains = true;
      this.showLimitTime = false;
      this.showLimitScope = true;
      this.showDateRange = false;
      this.showStatuses = false;
      break;
    case '4':
    case '5':       
    case '8':
      this.showIs = false;
      this.showContains = false;
      this.showLimitTime = false;
      this.showDateRange = true;
      this.showLimitScope = true;
      this.showStatuses = false;
      break;
  }
}

function TransactionGrid() {
  return {
    bindings: {
      form: '=',
      ngModel: '='
    },
    templateUrl:'../scripts/quoteComponents/field-components/transactionGrid/transactionGrid.component.html',
    controller: ['$scope', 'ModelHelper', 'uiGridConstants', 'decisionService', 'LookupDataService', 'SearchTransactionService', 'userInfoConfig','spinnerService','ErrorService','navigationService',
      function ($scope, modelHelper, uiGridConstants, decisionService, lookupDataService, searchTransactionService, userInfoConfig,spinnerService, errorService, navigationService) {

        // setup default search criteria
        this.searchCriteria = searchTransactionService.getInitialSearch();

        // Setup default referral request
        this.referralRequest = GetInitialReferralRequest(modelHelper, userInfoConfig);

        // prefill all the select boxes
        this.limitSearchFromTypes = lookupDataService.getLimitSearchFromTypes();
        this.markelSearchRegions = lookupDataService.getMarkelSearchRegions();
        this.searchTypeList = lookupDataService.getSearchTypes();
        this.markelStatuses = lookupDataService.getSearchStatuses();

        // Get the default search type from the meta data
        this.defaultSearchType = _.find(this.searchTypeList, function(searchTypeItem){
          if(searchTypeItem.meta && searchTypeItem.meta.default && searchTypeItem.meta.default == true){
            return true;
          }
        });

        // Default the controls to whatever the default search type is
        if(this.defaultSearchType){
          this.searchCriteria.SearchType = this.defaultSearchType.value;
          ShowSearchControls.call(this, this.defaultSearchType.value);
        }

        // User changed the SearchType this shows which controls to display
        this.searchTypeChanged = function(searchType){
          searchTransactionService.updateSearchCriteria(this.searchCriteria);
          ShowSearchControls.call(this, searchType);
        };

        // Customer initiated search
        this.searchTransactions = function()
        {
          getPage(this.referralRequest, this.searchCriteria, this.paginationOptions)
        };

      this.localScope = $scope;
      var self = this;

      this.paginationOptions = {
        pageNumber: 1,
        pageSize: 10,
        sortDirection: null,
        sortProperty: null
      };      

      this.localScope = $scope;
      $scope.openTransaction = function(transactionId){
        spinnerService.show('processingSpinner');
        console.log('Hi sonali ' + transactionId);
        //Sonali - We need to put lock on transaction while opening, uncomment below line when we have an option to unlock
        //decisionService.putTransactionLock(transactionId); 
        decisionService.getPolicyById(transactionId).then(function (policyResult) {       
                var lastVisitedStep = angular.fromJson(policyResult).LastVisitedStep;              
                $scope.visitLastPage(lastVisitedStep, transactionId);
                spinnerService.hide('processingSpinner');
              }, function (error) {
                errorService.showSystemError('Open Transaction : getPolicyById failed', error);
              }); 
      }

      $scope.visitLastPage = function(lastVisitedStep, transactionId){
      switch (lastVisitedStep) {
                  //Account info
                  case EnumApplicationFlow.AccountInformation:
                      navigationService.navigateTo({transactionId: transactionId}, 'AccountInformation');                        
                      break;
                  //CoverageSelection
                  case EnumApplicationFlow.CoverageSelection:
                     navigationService.navigateTo({transactionId: transactionId}, 'CoverageSelection');                    
                     break;
                  //RatesPremiums
                  case EnumApplicationFlow.RatesPremiums:
                    navigationService.navigateTo({transactionId: transactionId}, 'RatesPremiums');      
                    break;
                  //ReviewQuote
                  case EnumApplicationFlow.ReviewQuote:
                    navigationService.navigateTo({transactionId: transactionId}, 'ReviewQuote');    
                    break;
                 //ReviewBind
                  case EnumApplicationFlow.ReviewBind:
                    navigationService.navigateTo({transactionId: transactionId}, 'ReviewBind');    
                    break;
                 //Review Issue
                  case EnumApplicationFlow.ReviewIssue:
                    navigationService.navigateTo({transactionId: transactionId}, 'ReviewIssue'); 
                    break;
                  default:
                    navigationService.navigateTo({transactionId: transactionId}, 'AccountInformation'); 
          }
      }

      $scope.gridOptions = {
        enableColumnMenus: false,
        enablePaginationControls: false,
        useExternalSorting: true,
        useExternalPagination: true,
        paginationPageSize: 10,
        columnDefs: [
          {
            name: 'Status', field: 'Status',
            cellTemplate: '<div class="ui-grid-cell-contents" title="{{Status}}"></div>'
          },
          {name: 'Account name', field: 'AccountName'},
          {name: 'Transaction', field: 'TransactionNumber'},
          {name: 'Producer', field: 'ProducerName'},
          {name: 'Working User', field: 'getWorkingUserName()'},
          {name: 'Referred', field: 'ReferredDate', cellFilter: 'date:"MM/dd/yyyy\"'},
          {name: 'Effective', field: 'Effective', cellFilter: 'date:"MM/dd/yyyy\"'},
          {
            name: 'Actions', cellTemplate: ['<div class="action-icons">',
            '<a href="" ng-click="grid.appScope.openTransaction(row.entity.Id)">',
            '<span data-toggle=\'tooltip\' data-original-title=\'View / Edit\'>',
            '<i class="glyphicon glyphicon-search"></i>',
            '</span>',
            '</a>',
            '<a href="#/open-readonly-transaction/{{row.entity.Id}}">',
            '<span data-toggle="tooltip" data-original-title="Read Only">',
            '<i class="glyphicon glyphicon-book"></i>',
            '</span>',
            '</a>',
            '<a href="#confirm-discard-modal" class="confirm-discard-modal" data-toggle="modal">',
            '<span data-toggle=\'tooltip\' data-original-title=\'Delete\'>',
            '<i class="glyphicon glyphicon-remove"></i>',
            '</span>',
            '</a>',
            '<div class="dropdown">',
                    '<a href="#" class="dropdown-link" data-toggle="dropdown"><i class="fa fa-files-o"/></a>',
                    '<ul class="dropdown-menu">',
                        '<li><a href="/QuickQuote/SimilarRiskCopy/1916adf4-eab9-4c0c-bfec-39dca9a00220">Copy for similar risk</a></li>',
                    '</ul>',
               ' </div>',
            '<div class="dropdown">',
            '<a href="#" class="dropdown-link" data-toggle="dropdown"><i class="fa fa-files-o"></i></a>',
            '<ul class="dropdown-menu">',
            '<li><a href="/QuickQuote/SimilarRiskCopy/{{row.entity.Id}}">Copy for similar risk</a></li>',
            '</ul>',
            '</div>',
            '<a href="#" data-toggle="row-details"   class="referral-status"       >',
            '<span data-toggle=\'tooltip\' data-original-title=\' Referral Info \'>',
            '<i class="glyphicon glyphicon-chevron-down"></i>',
            '</span>',
            '</a>',
            '</div>'].join('')
          }
        ],
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            if (sortColumns.length == 0) {
              self.paginationOptions.sortDirection = null;
            } else {
              self.paginationOptions.sortDirection = sortColumns[0].sort.direction == uiGridConstants.ASC ? 0 : 1;
            }
            self.paginationOptions.sortProperty = sortColumns[0] != null ? sortColumns[0].field : null;
            self.paginationOptions.pageNumber = 1;
            if ($scope.gridApi.pagination.getPage() > 1) {
              $scope.gridApi.pagination.seek(1);
            }
            getPage(self.referralRequest, self.searchCriteria, self.paginationOptions);
          });
          gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            self.paginationOptions.pageNumber = newPage;
            self.paginationOptions.pageSize = pageSize;
            getPage(self.referralRequest, self.searchCriteria, self.paginationOptions);
          });
        }
      };

      var getPage = function (referralRequest, searchCriteria, paginationOptions) {

        searchTransactionService.updateSearchRequest(searchCriteria, referralRequest);

        // Update the request
        referralRequest.PageNumber = paginationOptions.pageNumber;
        referralRequest.SortProperty = paginationOptions.sortProperty == null ? 'referred' : paginationOptions.sortProperty;
        referralRequest.PageSize = paginationOptions.pageSize;
        referralRequest.SortDirection = paginationOptions.sortDirection;

        decisionService.getTransactionData('Search', referralRequest).then(function (response) {
          angular.forEach(response.Policies, function (row) {
            row.getWorkingUserName = function () {
              return row.WorkingUserName == null ? row.CreatedByName : row.WorkingUserName;
            };
          });

          $scope.gridOptions.totalItems = response.TotalCount;
          $scope.gridOptions.paginationOptions = paginationOptions;
          $scope.gridOptions.data = response.Policies;
        });

      };

      getPage(this.referralRequest, this.searchCriteria, this.paginationOptions);
    }]
  }
}
