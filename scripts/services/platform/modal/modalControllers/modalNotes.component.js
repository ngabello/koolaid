/**
 * Created by ngabelloa on 11/16/2016.
 */
angular.module('platform.modal')
    .controller('modalNotesController', ['$rootScope', '$uibModalInstance', '$log', 'params', 'decisionService', 'HeaderDocumentService', 'Constants',
        function($rootScope, $uibModalInstance, $log, params, decisionService, headerDocumentService, constants) {

            var notesModalVM = this;
            notesModalVM.isInternalUser = headerDocumentService.getHeaderIsInternal();

            notesModalVM.riskUnits = [];

            decisionService.getGuidelinesNotes(params.classId, params.classOrder, params.lob).then(function(response) {
                if (_.isObject(response) && response.hasOwnProperty('RiskUnits')) {
                    _.each(response.RiskUnits, function(riskUnit) {
                        var riskUnit = {
                            ClassCode: riskUnit.ClassCode,
                            ClassDescription: riskUnit.ClassDescription,
                            Eligibility: riskUnit.Eligibility,
                            Notes: riskUnit.Notes,
                            InternalNotes: riskUnit.InternalNotes,
                            Guidelines: _.chain(riskUnit.Guidelines)
                                .filter(function(item) { return item.GuidelineType != 'O' })
                                .groupBy(function(item) { return item.GuidelineType })
                                .sortBy(function(item, index) { return Object.keys(constants.GuidelineType).indexOf(index) })
                                .value(),
                            showGuidelines: function() {
                                return this.Eligibility !== constants.Eligibility.Submit && this.Guidelines.length > 0;
                            },
                            getGuidelineTypeName: function(type) {
                                return constants.GuidelineType[type];
                            },
                            accordionState: {
                                notes: true,
                                guidelines: true
                            }
                        };
                        notesModalVM.riskUnits.push(riskUnit);
                    });
                }
            }, function(error) {
                $log.error('modalNotesController: retrieving guidelines notes failed', error);
            });

            //close modal when you navigate away
            $rootScope.$on('$locationChangeStart', function() {
                $uibModalInstance.close();
            });

            notesModalVM.close = function() {
                $uibModalInstance.close();
            };
        }
    ]);