/**
 * Created by smeshram on 01/19/2017.
 */
'use strict';
function WelcomeComponent() {
 
  return {
    require: '^form', 
    bindings:{
     
    }  ,
    templateUrl: '../scripts/quoteComponents/field-components/welcome/welcome.component.html',    
    controller: ['spinnerService', function (spinnerService) {
        var self = this;
  }]}
};