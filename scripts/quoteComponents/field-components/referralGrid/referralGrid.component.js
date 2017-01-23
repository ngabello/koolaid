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
  return referralRequest;
}

function ReferralGrid() {
  return {
    bindings: {
      form: '=',
      ngModel: '='
    },
    templateUrl:'../scripts/quoteComponents/field-components/referralGrid/referralGrid.component.html',
    controller: ['$scope', 'ModelHelper', 'uiGridConstants', 'decisionService', 'userInfoConfig',
      function ($scope, modelHelper, uiGridConstants, decisionService, userInfoConfig) {

      this.referralRequest = GetInitialReferralRequest(modelHelper, userInfoConfig);
      this.localScope = $scope;
      var self = this;

      this.paginationOptions = {
        pageNumber: 1,
        pageSize: 5,
        sortDirection: null,
        sortProperty: null
      };

      $scope.gridOptions = {
        enableColumnMenus : false,
        enablePaginationControls: false,
        useExternalSorting: true,
        useExternalPagination: true,
        paginationPageSize: 5,
        columnDefs: [
          {name: 'Status', field: 'Status',
            cellTemplate: '<div class="ui-grid-cell-contents" title="{{COL_FIELD}}"></div>'},
          {name: 'Account name', field: 'AccountName'},
          {name: 'Transaction', field: 'TransactionNumber'},
          {name: 'Producer', field: 'ProducerName'},
          {name: 'Working User', field: 'getWorkingUserName()'},
          {name: 'Referred', field: 'ReferredDate', cellFilter: 'date:"MM/dd/yyyy\"'},
          {name: 'Effective', field: 'Effective', cellFilter: 'date:"MM/dd/yyyy\"' },
          {
            name: 'Actions', cellTemplate: ['<div class="action-icons">',
            '<a href="/QuickQuote/OpenTransaction/{{row.entity.Id}}">',
            '<span data-toggle=\'tooltip\' data-original-title=\'View / Edit\'>',
            '<i class="glyphicon glyphicon-search"></i>',
            '</span>',
            '</a>',
            '<a href="/QuickQuote/OpenReadonlyTransaction/{{row.entity.Id}}">',
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
            if($scope.gridApi.pagination.getPage() > 1){
              $scope.gridApi.pagination.seek(1);
            }
            getPage(self.referralRequest, self.paginationOptions);
          });
          gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            self.paginationOptions.pageNumber = newPage;
            self.paginationOptions.pageSize = pageSize;
            getPage(self.referralRequest, self.paginationOptions );
          });
        }
      };

      var getPage = function (referralRequest, paginationOptions) {
        // Update the request
        referralRequest.PageNumber = paginationOptions.pageNumber;
        referralRequest.SortProperty = paginationOptions.sortProperty == null ? 'referred' : paginationOptions.sortProperty;
        referralRequest.PageSize = paginationOptions.pageSize;
        referralRequest.SortDirection = paginationOptions.sortDirection;

        decisionService.getTransactionData('Referrals', referralRequest).then(function (response) {
          //Update the response data with some modifications
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

      getPage(this.referralRequest, this.paginationOptions);
    }]
  }
}
