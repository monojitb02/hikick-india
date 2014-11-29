'use strict';

module.exports = function($scope, $state) {
    $scope.login = function() {
        $state.go('app.home');
    };
}
