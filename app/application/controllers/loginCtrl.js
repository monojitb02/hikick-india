'use strict';

var utility = require('../../util');

module.exports = function($scope, $state) {

    var id = utility.getCookie('uid'),
        loginForm;
    if (id) {
        $state.go('app.home');
    }
    //dummy login
    $scope.uname = 'asis';
    $scope.password = 'asis';

    $scope.login = function() {
        console.log(loginForm.valid());
        if (loginForm.valid()) {
            utility.setCookie('uid', $scope.uname);
            $state.go('app.home');
        }
    };

    $scope.$on('$viewContentLoaded', function() {
        loginForm = jQuery("#login_form");
        loginForm.validate({
            rules: {
                uname: {
                    required: true,
                    minlength: 4
                },
                password: {
                    required: true,
                    minlength: 4
                }
            }
        });
    });
};
