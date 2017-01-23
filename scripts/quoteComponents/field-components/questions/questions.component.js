/**
 * Created by ngabelloa on 11/11/2016.
 */
'use strict';

function QuestionsComponent() {

    return {
        require: '^form',
        bindings: {
            list: '=',
            classOrder: '<',
            service: '<',
            lob: '<',
            policy: '<',
            onUpdate: '&'
        },
        templateUrl: '../scripts/quoteComponents/field-components/questions/questions.component.html',
        controller: ['LookupDataService',
            function(lookupData) {
                var self = this;

                self.getQuestionType = function(questionTypeId) {
                    var questionTypes = lookupData.getQuestionTypes();
                    if (questionTypes == null)
                        return "";

                    var qType = _.find(questionTypes, function(item) {
                        return item.value == questionTypeId;
                    });

                    return qType ? qType.desc : "";
                }
            }
        ]
    }
}