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
    };
    /*jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });
    jQuery("#login_form").validate({
        rules: {
            uname: {
                required: true
            },
            password: {
                required: true
            }
        }
    });*/
};
