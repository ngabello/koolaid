/**
 * Created by ngabelloa on 11/11/2016.
 */
'use strict';
function ProgressMenu() {

  return {
    require: '^form',
    bindings: {
      updateSearchResults: '&'
    },
    templateUrl:'../scripts/quoteComponents/field-components/progressMenu/progressMenu.component.html',
    controller: ['LookupDataService',
      function (lookupData) {


      }]
  }
}
