'use strict';

var config = require('../../config');
var api = require('../../util/api');
var findState = function(states, stateCode) {
        for (var i in states) {
            if (states[i].value === stateCode.trim()) {
                return states[i];
            }
        }
    },
    getClubNames = function() {
        $http({
            url: api.searchTempParticipant,
            method: 'GET'
        }).success(function(result) {
            if (result.success) {
                $scope.clubs = result.data;
                $scope.clubs.push({
                    name: 'Others'
                });
            }
        }).error(function() {
            $scope.message = lang.networkError;
            $scope.showMessage = true;
        });
    };

module.exports = function($scope, $http, $state) {

    var registrationForm, findParticipantForm;
    $scope.states = config.states;
    $scope.participant = {};
    $scope.clubs = [{
        name: 'Royal Club'
    }, {
        name: 'Lions Club'
    }, {
        name: 'Others'
    }];
    $scope.fetchParticipant = function() {
        if (findParticipantForm.valid()) {
            $http({
                url: api.searchTempParticipant,
                method: 'GET',
                params: {
                    name: $scope.searchKey
                }
            }).success(function(result) {
                if (result.success) {
                    $scope.participants = result.data;
                } else {
                    $scope.message = result.errfor.message;
                    $scope.showMessage = true;
                }
            }).error(function() {
                $scope.message = lang.networkError;
                $scope.showMessage = true;
            });
        }
    };
    $scope.findParticipant = function() {
        $http({
            url: api.findTempParticipant,
            method: 'GET',
            params: {
                registrationId: $scope.searchKey
            }
        }).success(function(result) {
            if (result.success) {
                $scope.participant = result.data;
                $scope.participant.state = findState($scope.states, $scope.participant.state);
                $scope.participant.choiceOfEvents = {
                    kata: $scope.participant.kata,
                    kumite: $scope.participant.kumite,
                    weapons: $scope.participant.weapons,
                };
            } else {
                $scope.message = result.errfor.message;
                $scope.showMessage = true;
            }
        }).error(function() {
            $scope.message = lang.networkError;
            $scope.showMessage = true;
        });
    };
    $scope.register = function() {
        if (registrationForm.valid()) {
            $scope.participant.participantId = $scope.searchKey; //......................TODO
            $scope.participant.clubName = $scope.participant.clubName /* | $scope.club.name*/ ;
            $http({
                url: api.add,
                method: 'POST',
                data: $scope.participant
            }).success(function(result) {
                if (result.success) {

                } else {
                    $scope.message = result.errfor.message;
                    $scope.showMessage = true;
                }
            }).error(function() {
                $scope.message = lang.networkError;
                $scope.showMessage = true;
            });
        }
    };
    $scope.reset = function() {
        $scope.participant = {};
    };

    //date picker handler
    $scope.participant.dob = '';
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
                    required: true
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
