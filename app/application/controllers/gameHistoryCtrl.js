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
            url: api.gameHistory,
            method: "GET"
        })
        .success(function(result) {
            if (result.success) {
                $scope.totalmatchs = result.data;
                $scope.$watch('currentPage', function() {
                    $scope.matchs = $scope.totalmatchs.slice(($scope.currentPage - 1) * $scope.itemsPerPage, ($scope.currentPage * $scope.itemsPerPage));
                });
            }
        })
        .error(function() {
            $scope.message = lang.networkError;
            $scope.showMessage = true;
            hideMessage();
        });

}
