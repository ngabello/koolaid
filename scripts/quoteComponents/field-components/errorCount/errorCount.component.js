/**
 * Created by ngabelloa on 1/19/2017.
 */
'use strict';
function ErrorCountComponent() {

  return {
    require: {parentForm: '^form'},
    bindings: {
      formSubmitted: '='
    },
    templateUrl: '../scripts/quoteComponents/field-components/errorCount/errorCount.component.html',
    controller: [ function () {
      var self = this;

      self.numberOfErrors = function(){
        if(!self.formSubmitted){
          return;
        }
        var count = 0, errors = self.parentForm.$error;
        angular.forEach(errors, function(val){
          if(angular.isArray(val))
          {
            count += val.length;
          }
        });
        return count || 0;
      }
    }]
  }
}
