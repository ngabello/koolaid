/**
* Created by SMeshram on 01/16/2017
 */

'use strict';
function BindComponent(){
return {
    require: {parentForm : '^form'},
    bindings:{
        downloadQuoteDoc : '&',
        downloadQuoteLetter : '&',
        imageSource : '<'
    },
    templateUrl : '../scripts/quoteComponents/field-components/bindControl/bindControl.component.html',
    controller : [function(){
   
      var self= this;

      this.downloadDoc =function(){
        self.downloadQuoteDoc({form: self.parentForm});
      };

      this.downloadLetter =function(){
        self.downloadQuoteLetter({form: self.parentForm});
      };
    }]
 }
}