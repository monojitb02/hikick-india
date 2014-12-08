'use strict';

module.exports = function($scope, $http, $modalInstance) {
    //close the modal window
    $scope.close = function() {
        $modalInstance.close();
    };
}
