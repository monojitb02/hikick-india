'use strict';

var api = require('../../util/api');
var fs = require('fs');
module.exports = function($scope, $state, $http, $modal, exchangeParticipant) {
    var hideMessage = function() {
        $timeout(function() {
            $scope.showMessage = false;
        }, 2000);
    };

    //pagination config
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $http({
            url: api.participantList,
            method: 'GET'
        })
        .success(function(result) {
            if (result.success) {
                $scope.totalParticipants = result.data;
                $scope.afterSearchParticipants = result.data;
                $scope.$watch('currentPage', function() {
                    $scope.participants = $scope.afterSearchParticipants.slice(($scope.currentPage - 1) * $scope.itemsPerPage, ($scope.currentPage * $scope.itemsPerPage));
                });
            }
        })
        .error(function() {
            $scope.message = lang.networkError;
            $scope.showMessage = true;
            hideMessage();
        });

    //search parent array
    $scope.search = function() {
        $scope.afterSearchParticipants = $scope.totalParticipants.filter(function(participant) {
            return participant.name.match(new RegExp($scope.searchKey, 'i'));
        });
        $scope.participants = $scope.afterSearchParticipants.slice(($scope.currentPage - 1) * $scope.itemsPerPage, ($scope.currentPage * $scope.itemsPerPage));
    };
    //opens the modal window to view participant details
    $scope.viewDetails = function(participant) {
        $http({
                url: api.findParticipant,
                method: 'GET',
                params: {
                    participantId: participant.participantId
                }
            })
            .success(function(result) {
                if (result.success) {
                    $scope.participant = result.data[0];
                    var modalInstance = $modal.open({
                        template: fs.readFileSync(__dirname + '/../templates/viewParticipantModal.html'),
                        controller: 'viewParticipantModalCtrl',
                        size: 'lg',
                        scope: $scope
                    });
                }
            })
            .error(function() {
                $scope.message = lang.networkError;
                $scope.showMessage = true;
                hideMessage();
            });
    };

    //opens the modal window to delete participant details
    $scope.deleteDetails = function(participant) {
        $scope.participant = participant;
        var modalInstance = $modal.open({
            template: fs.readFileSync(__dirname + '/../templates/deleteParticipantModal.html'),
            controller: 'deleteParticipantModalCtrl',
            size: 'sm',
            scope: $scope
        });
    };
    //opens the modal window to edit participant details
    $scope.editDetails = function(participant) {
        $http({
                url: api.findParticipant,
                method: 'GET',
                params: {
                    participantId: participant.participantId
                }
            })
            .success(function(result) {
                if (result.success) {
                    exchangeParticipant.setParticipant(result.data[0]);
                    $state.go('app.editCandidate');
                } else {
                    $scope.message = result.errfor.message;
                    $scope.showMessage = true;
                    hideMessage();
                }
            })
            .error(function() {
                $scope.message = lang.networkError;
                $scope.showMessage = true;
                hideMessage();
            });
    };
};
