'use strict';

var api = require('../../util/api');

module.exports = function($scope, $http, $modal) {
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
            method: "GET"
        })
        .success(function(result) {
            if (result.success) {
                $scope.totalParticipants = result.data;
                $scope.$watch('currentPage', function() {
                    $scope.participants = $scope.totalParticipants.slice(($scope.currentPage - 1) * $scope.itemsPerPage, ($scope.currentPage * $scope.itemsPerPage));
                });
            }
        })
        .error(function() {
            $scope.message = lang.networkError;
            $scope.showMessage = true;
            hideMessage();
        });

    //opens the modal window to view participant details
    $scope.viewDetails = function(participant) {
        $http({
                url: api.findParticipant,
                method: "GET",
                params: {
                    participantId: participant.participantId
                }
            })
            .success(function(result) {
                if (result.success) {
                    $scope.participant = result.data[0];
                    var modalInstance = $modal.open({
                        template: require('fs').readFileSync(__dirname + '/../templates/viewParticipantModal.html'),
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
    $scope.editDetails = function(participant) {

    };

    //opens the modal window to delete participant details
    $scope.deleteDetails = function(participant) {
        $scope.participant = participant;
        var modalInstance = $modal.open({
            template: require('fs').readFileSync(__dirname + '/../templates/deleteParticipantModal.html'),
            controller: 'deleteParticipantModalCtrl',
            size: 'sm',
            backdrop: 'static',
            scope: $scope
        });
    };
}
