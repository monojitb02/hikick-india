'use strict';

var api = require('../../util/api');

module.exports = function($scope, $http, $modalInstance) {
    var hideMessage = function() {
        $timeout(function() {
            $modalInstance.close();
        }, 2000);
    };

    //close the modal window
    $scope.delete = function() {
        $scope.hideClose = true;

        $http({
                url: api.participantList,
                method: "GET"
            })
            .success(function(result) {
                $scope.hideClose = false;
                if (result.success) {
                    $scope.messageModal = lang.deletedSuccessfully;
                } else {
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
