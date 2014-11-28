'use strict';
var config = require('../../../config'),
    api = require('../../../util/api'),
    apiKey = config.apiKey;

module.exports = function($scope, $http, $state) {

    $scope.playVideo = function(video) {
        generateVideoId.setVideo(video);
        $state.go('app.player');
    };
    //close the alerty 
    $scope.closeAlert = function() {
        $scope.added = false;
    };
}
