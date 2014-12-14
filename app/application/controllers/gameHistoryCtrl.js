'use strict';

var api = require('../../util/api');
var fs = require('fs');

module.exports = function($scope, $http, $modal, $timeout) {
    var hideMessage = function() {
        $timeout(function() {
            $scope.showMessage = false;
        }, 2000);
    };
    $scope.viewDetails = function(match) {
        $scope.currentMatch = match;
        $modal.open({
            template: fs.readFileSync(__dirname + '/../templates/gameHistoryModal.html'),
            controller: 'gameHistoryModalCtrl',
            size: 'lg',
            scope: $scope
        });
    };

    //pagination config
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $http({
            url: api.getMatchList,
            method: "GET"
        })
        .success(function(result) {
            if (result.success) {
                $scope.totalmatchs = result.data;
                $scope.$watch('currentPage', function() {
                    $scope.matches = $scope.totalmatchs.slice(($scope.currentPage - 1) * $scope.itemsPerPage, ($scope.currentPage * $scope.itemsPerPage));
                });
            }
        })
        .error(function() {
            $scope.message = lang.networkError;
            $scope.showMessage = true;
            hideMessage();
        });

}
