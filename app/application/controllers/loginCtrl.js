'use strict';

var utility = require('../../util');
var api = require('../../util/api')

module.exports = function($scope, $rootScope, $state, $http) {

    var id = utility.getCookie('uid'),
        loginForm;
    if (id) {
        $state.go('app.home');
    }

    //dummy login
    $scope.email = 'admin.hikickindia@gmail.com';
    $scope.password = '1234';

    //login user
    $scope.login = function() {
        if (loginForm.valid()) {
            $http({ //get image urls from remote server
                url: api.login,
                method: 'POST',
                data: {
                    email: $scope.email,
                    password: $scope.password,
                    secure: false
                }
            }).success(function(result) {
                if (result.success) {
                    $rootScope.user = result.data;
                    utility.setCookie('uid', result.data._id);
                    $state.go('app.home');
                } else {
                    $scope.message = result.errfor.message;
                    $scope.showMessage = true;
                }
            }).error(function() {
                $scope.message = lang.networkError;
                $scope.showMessage = true;
            });
        }
    };
    //close the alert of no result found
    $scope.closeAlert = function(index) {
        $scope.showMessage = false;
    };
    //validation of form
    $scope.$on('$viewContentLoaded', function() {
        loginForm = jQuery("#login_form");
        loginForm.validate({
            rules: {
                email: {
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
