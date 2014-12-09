'use strict';

module.exports = function($scope, $modalInstance) {
    //close the modal window
    $scope.close = function() {
        $modalInstance.close();
    };
}
