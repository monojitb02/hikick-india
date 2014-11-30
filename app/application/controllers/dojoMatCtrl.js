'use strict';

module.exports = function($scope, $http, $state) {
    var clock = jQuery('.clock').FlipClock(60, {
        countdown: true,
        clockFace: 'MinuteCounter'
    });
    console.log(clock);
    $scope.stop = function() {
        clock.running ? clock.stop() : clock.start();
    };
}