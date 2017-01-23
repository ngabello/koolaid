/**
 * Created by ngabelloa on 11/3/2016.
 */

function DatePicker() {
  return {
    bindings: {
      form: '=',
      ngModel: '=',
      dateFormat: '<',
      isRequired: '<',
      labelName: '<'
    },
    template: [
      '   <div class="row" >',
      '     <label id="Column2Label">{{$ctrl.labelName}}</label>',
      '       <div class="col-md-6">',
      '         <p class="input-group">',
      '           <input type="text" class="form-control" show-weeks="false" show-button-bar="false" uib-datepicker-popup="{{$ctrl.dateFormat}}" ng-model="$ctrl.ngModel" is-open="$ctrl.popup.opened" datepicker-options="$ctrl.dateToOptions" ng-required="$ctrl.isRequired" />',
      '           <span class="input-group-btn">',
      '             <button type="button" class="btn btn-default" ng-click="$ctrl.open()"><i class="glyphicon glyphicon-calendar"></i></button>',
      '           </span>',
      '         </p>',
      '       </div>',
      '   <div>'
    ].join(''),
    controller: [function () {

        this.dateToOptions = {
          formatYear: 'yy',
          maxDate: new Date(2020, 5, 22),
          minDate: new Date()
        };

        this.open = function() {
          this.popup.opened = true;
        };

        this.popup = {
          opened: false
        };
      }]
  }
}
