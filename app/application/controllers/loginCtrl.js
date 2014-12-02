'use strict';

var utility = require('../../util');

module.exports = function($scope, $state, $location) {
    $scope.login = function() {
        utility.setCookie('uid', $scope.uname);
        $state.go('app.home');
        //$location.path('/home');
    };
    jQuery.validator.setDefaults({
  		debug: true,
  		success: "valid"
	});
    jQuery("#login_form").validate({
        rules: {
            uname: {
                required: true
            },
            password:{
            	required:true
            }
        }
    });
};
