'use strict';

module.exports = function($scope, $http, $state) {

    var registrationForm, findParticipantForm;
    $scope.fetchParticipant = function() {
        if (findParticipantForm.valid()) {

        }
    };
    $scope.register = function() {
        if (registrationForm.valid()) {

        }
    };
    $scope.reset = function() {
        registrationForm.resetForm();
    };

    //date picker handler
    $scope.dob = '';
    $scope.today = new Date();

    $scope.clear = function() {
        $scope.dob = null;
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        'show-weeks': false
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    //validator initialize
    $scope.$on('$viewContentLoaded', function() {
        findParticipantForm = jQuery('#find_participant_form');
        findParticipantForm.validate({
            rules: {
                id: {
                    required: true,
                    number: true,
                    maxlength: 10
                }
            }
        });
        registrationForm = jQuery('#registration_form');
        registrationForm.validate({
            rules: {
                name: {
                    required: true
                },
                instructorName: {
                    required: true
                },
                dob: {
                    required: true,
                    date: true
                },
                weight: {
                    required: true,
                    number: true
                },
                country: {
                    required: true
                },
                phno: {
                    required: true,
                    minlength: 10
                },
                email: {
                    required: true,
                    email: true
                },
                address: {
                    required: true
                }

            }
        });
    });
}
