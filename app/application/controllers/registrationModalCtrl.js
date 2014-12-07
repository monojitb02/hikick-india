'use strict';

module.exports = function($scope, $modalInstance) {
    //close the modal window
    $scope.close = function() {
        $modalInstance.close();
    };
    //print the modal window
    $scope.print = function() {
        $modalInstance.close();
    };
    $modalInstance.result.then(function(selectedItem) {
        $scope.reset();
    }, function() {
        $scope.reset();
    });
}
