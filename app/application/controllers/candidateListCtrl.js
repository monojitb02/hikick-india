'use strict';

var api = require('../../util/api');

module.exports = function($scope, $http) {
    var hideMessage = function() {
        $timeout(function() {
            $scope.showMessage = false;
        }, 2000);
    };

    $scope.currentPage = 1;
    $scope.itemsPerPage = 20;
    $http({
            url: api.participantList,
            method: "GET"
        })
        .success(function(result) {
            $scope.totalParticipants = result.data;
            $scope.$watch('currentPage', function() {
                $scope.participants = $scope.totalParticipants.slice(($scope.currentPage - 1) * 20, ($scope.currentPage * 20));
            });
        })
        .error(function() {
            $scope.message = lang.networkError;
            $scope.showMessage = true;
            hideMessage();
        });

    //codes to control pagination

}
