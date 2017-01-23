
'use strict';
function DocumentQuestionsComponent() {

  return {
    require: '^form',
    bindings: {
      questions: '<'
    },
    templateUrl: '../scripts/quoteComponents/field-components/questions/documentQuestions.component.html',
    controller: [
      function () {
        var self = this;

        self.$onInit = function () {
          self.questions = _(self.questions).chain().sortBy(function (question) {

            if (question.MultipleRowGroupingNumber) {
              return _(self.questions).chain().filter(function (item) {
                item.MultipleRowGroupingNumber == question.MultipleRowGroupingNumber
              }).min('Order').value().Order;
            }

            return question.Order;
          }).sortBy('MultipleRowGroupingNumber').sortBy('Row').sortBy('Column').value();
        }

      }]
  }
}
