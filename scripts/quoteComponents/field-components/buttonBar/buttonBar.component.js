/**
 * Created by ngabelloa on 12/20/2016.
 */
'use strict';
function ButtonBarComponent() {

  return {
    require: {parentForm: '^form'},
    bindings: {
      next: '&',
      back: '&',
      save: '&',
      disableBack: '<',
      formSubmitted: '='
    },
    templateUrl: '../scripts/quoteComponents/field-components/buttonBar/buttonBar.component.html',
    controller: ['$location', '$anchorScroll', function ($location, $anchorScroll) {

      this.$onInit = function () {
        if(!this.disableBack) {
          this.disableBack = false;
        }
      };

        var self = this;

        this.navigateBack = function(){
          self.back({form: self.parentForm});
        };

        this.savePolicy = function(){
          if(self.parentForm.$valid) {
            self.save({form: self.parentForm});
          }
        };

        this.continue = function(){
          self.formSubmitted = true;
          if(self.parentForm.$valid) {
            self.next({form: self.parentForm});
          }else{
            angular.element("[name='" + self.parentForm.$name + "']").find('.ng-invalid:visible:first').focus();
            return false;
          }
        };
      }]
  }
}
