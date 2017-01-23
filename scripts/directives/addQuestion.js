/**
 * Created by ngabelloa on 12/8/2016.
 */
function AddQuestion() {
    'use strict';

    function getTemplateUrl(question) {
        var fields = [
            'textBox',
            'numericTextBox',
            'dropDown',
            'list',
            'multiSelectList',
            'slider',
            'radioButton',
            'checkBox',
            'datePicker',
            'staticText',
            'textArea'
        ]

        return '../scripts/directives/fieldTemplate/' + fields[question.DisplayFormat] + '.html';
    }

    return ['$compile', '$http', 'LookupDataService', 'decisionService', function($compile, $http, lookupData, decisionService) {
        return {
            restrict: "E",
            scope: {
                question: "=",
                /*ngModel: "=",*/
                /*readOnly: "<",*/
                index: "<",
                classOrder: "<",
                service: '<',
                lob: '<',
                policy: '<',
                onUpdate: '&'
            },
            replace: true,
            link: function(scope, element, attrs) {

                // GET template content from path
                var templateUrl = getTemplateUrl(scope.question);
                $http.get(templateUrl).success(function(data) {
                    element.html(data);
                    $compile(element.contents())(scope);
                });

                element.bind('click', function(e) {
                    scope.$apply(function() {

                        //Show guidelines modal(Coverage Selection Controller)
                        if (angular.element(e.target).hasClass('line-guidelines')) {
                            scope.$emit('line-guidelines-event');
                        }
                    });
                });
            },
            controller: ['$scope', function($scope) {

                $scope.valueChanged = function() {
                    var params = {
                        Order: $scope.question.Order,
                        ClassOrder: $scope.classOrder || 0,
                        Id: $scope.policy.Id,
                        Value: $scope.question.AnswerValue,
                        IsChecked: $scope.question.AnswerValue,
                        Lob: $scope.lob.Value
                    };

                    $scope.onUpdate({ service: $scope.service, params: params });
                }

            }]
        };
    }]
}