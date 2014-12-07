'use strict';

var config = require('../../config');
var api = require('../../util/api');

var findState = function(states, stateCode) {
    for (var i in states) {
        if (states[i].value === stateCode.trim()) {
            return states[i];
        }
    }
};

module.exports = function($scope, $http, $state, $timeout, $modal) {

    var registrationForm,
        hideMessage = function() {
            $timeout(function() {
                $scope.showMessage = false;
            }, 2000);
        };
    $scope.states = config.states;
    $scope.participant = {};
    $scope.participant.gender = 'M';

    $scope.reset = function() {
        $scope.participant = {};
        $scope.participant.gender = 'M';
    };
    //opens the modal window and create controller for it
    $scope.openModal = function(size) {
        var modalInstance = $modal.open({
            template: require('fs').readFileSync(__dirname + '/../templates/registrationModal.html'),
            controller: 'registrationModalCtrl',
            size: size,
            scope: $scope

        });
    };

    $scope.searchParticipant = function() {
        if ($scope.searchKey) {
            $http({
                url: api.searchTempParticipant,
                method: 'GET',
                params: {
                    name: $scope.searchKey
                }
            }).success(function(result) {
                if (result.success) {
                    $scope.showSearchResult = true;
                    $scope.participants = result.data;
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
    $scope.findParticipant = function(participant) {
        $http({
            url: api.findTempParticipant,
            method: 'GET',
            params: {
                registrationId: participant.registrationId
            }
        }).success(function(result) {
            var dob;
            if (result.success) {
                $scope.showSearchResult = false;
                $scope.participant = result.data;
                dob = result.data.dob.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2,$1,$3");
                $scope.participant.dob = new Date(dob).toISOString();
                $scope.participant.state = findState($scope.states, $scope.participant.state);
                $scope.participant.choiceOfEvents = {
                    kata: $scope.participant.kata,
                    kumite: $scope.participant.kumite,
                    weapons: $scope.participant.weapons,
                };

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


                $scope.searchKey = '';
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
    };
    $scope.register = function() {
        if (registrationForm.valid()) {
            $scope.participant.participantId = String(new Date().getTime()).substr(7, 13);
            if ($scope.club.name !== 'Others') {
                $scope.participant.clubName = $scope.club.name;
            }
            $scope.participant.clubName = $scope.participant.clubName.toUpperCase();
            $http({
                url: api.add,
                method: 'POST',
                data: $scope.participant
            }).success(function(result) {
                if (result.success) {
                    $scope.openModal('sm');
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
    $scope.checkEnter = function($event) {
        if ($event.keyCode === 13) {
            $scope.searchParticipant();
        }
    };

    //date picker handler
    $scope.participant.dob = new Date();
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
