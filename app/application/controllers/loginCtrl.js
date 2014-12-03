'use strict';

var utility = require('../../util');

module.exports = function($scope, $state) {

    var id = utility.getCookie('uid');
    if (id) {
        $state.go('app.home');
    }
    //dummy login
    $scope.uname = 'asis';
    $scope.password = 'asis';

    $scope.login = function() {
        utility.setCookie('uid', $scope.uname);
        $state.go('app.home');
        //$location.path('/home');
    };
};
