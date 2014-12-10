'use strict';

var config = require('../../config');
var api = require('../../util/api');

var findState = function(states, state) {
    for (var i in states) {
        if (states[i].value === state.value) {
            return states[i];
        }
    }
};

module.exports = function($scope, $http, $state, $timeout, exchangeParticipant) {

    var editParticipantForm, dob,
        hideMessage = function() {
            $timeout(function() {
                $scope.showMessage = false;
            }, 2000);
        };
    $scope.states = config.states;
    $scope.participant = exchangeParticipant.getParticipant();


    $http({
        url: api.clubs,
        method: 'GET'
    }).success(function(result) {
        var clubs = [];
        if (result.success) {
            for (var i in result.data) {
                clubs.push(result.data[i]);
            }
        }
        clubs.push({
            name: 'Others'
        });
        $scope.participant.state = findState($scope.states, $scope.participant.state);
        $scope.clubs = clubs;

        clubs = $scope.clubs.filter(function(club) {
            return (club.name === $scope.participant.clubName)
        })
        $scope.club = clubs.length ? clubs[0] : $scope.clubs[$scope.clubs.length - 1];
    }).error(function() {
        $scope.clubs.push({
            name: 'Others'
        });
        $scope.club = $scope.clubs[$scope.clubs.length - 1];
    });
    $scope.update = function() {
        if (editParticipantForm.valid()) {
            if ($scope.club.name !== 'Others') {
                $scope.participant.clubName = $scope.club.name;
            }
            $http({
                url: api.editParticipant,
                method: 'PUT',
                data: $scope.participant
            }).success(function(result) {
                if (result.success) {
                    $scope.message = lang.updatedSuccessfully;
                    $scope.showMessage = true;
                    $timeout(function() {
                        $state.go('app.candidateList');
                    }, 2000);
                } else {
                    $scope.message = result.errfor.message;
                    $scope.showMessage = true;
                    hideMessage();
                }
            }).error(function() {
                $scope.message = lang.networkError;
                $scope.showMessage = true;
                hideMessage();
            });
        }
    };

    //date picker handler
    $scope.today = new Date();

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
        editParticipantForm = jQuery('#edit_participant_form');
        editParticipantForm.validate({
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
