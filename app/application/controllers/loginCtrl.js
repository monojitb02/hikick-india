'use strict';

module.exports = function($scope, $state, $location) {
    $scope.login = function() {
        // $state.go('app.home');
        $location.path('/home');
    };
}
