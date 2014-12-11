'use strict';

var api = require('../../util/api');

module.exports = function($scope, $http, $modalInstance, $timeout) {
    var hideMessage = function() {
        $timeout(function() {
            $modalInstance.close();
        }, 1500);
    };

    //close the modal window
    $scope.delete = function() {
        $scope.hideClose = true;
        $http({
                url: api.deleteParticipant,
                method: "PUT",
                data: {
                    participantId: $scope.participant.participantId
                }
            })
            .success(function(result) {
                $scope.hideClose = false;
                if (result.success) {
                    // $scope.messageType = 'success';
                    $scope.messageModal = lang.deletedSuccessfully;
                    $scope.clearItem();
                } else {
                    // $scope.messageType = 'danger';
                    $scope.messageModal = result.errfor.message;
                }
                $scope.showMessageModal = true;
                hideMessage();
            })
            .error(function() {
                $scope.messageModal = lang.networkError;
                $scope.showMessageModal = true;
                hideMessage();
            });
    };
    $scope.close = function() {
        $modalInstance.close();
    };
}
