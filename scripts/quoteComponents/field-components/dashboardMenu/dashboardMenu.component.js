/**
 * Created by ngabelloa on 11/11/2016.
 */
'use strict';
function DashboardMenu() {

  return {
    require: '^form',
    bindings: {

    },
    templateUrl:'../scripts/quoteComponents/field-components/dashboardMenu/dashboardMenu.component.html',
    controllerAs: 'dashBoardVM',
    controller: ['LookupDataService', function (lookupData) {

      var dashBoardVM = this;
      dashBoardVM.tinymceModel = 'intial content';

      dashBoardVM.startTransaction = function(){
        console.log('start');
      };

      dashBoardVM.deleteTransaction = function(){
        console.log('delete');
      };

      dashBoardVM.copyTransaction = function(){
      console.log('copy');
      };

      dashBoardVM.tinymceOptions = {
        plugins: 'link image code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
        menubar: 'file edit format',
        browser_spellcheck: true,
        statusbar: false
      };

      dashBoardVM.saveNote = function(note){
        console.log(note);
        dashBoardVM.tinymceModel = null;
      }



    }]
  }
}
