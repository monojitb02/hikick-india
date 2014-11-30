'use strict';
var defaultTimerSeconds = 180;
module.exports = function($scope, $http, $state) {
    var clock = jQuery('.clock').FlipClock({
            countdown: true,
            autoStart: false,
            clockFace: 'MinuteCounter',
            callbacks: {
                start: function() {
                    $scope.gameRunning = !$scope.gameRunning;
                    timeBreaks.push(new Date());
                    console.log(timeBreaks);
                    console.log('The clock has started!');
                },
                stop: function() {
                    $scope.gameRunning = !$scope.gameRunning;
                    timeBreaks.push(new Date());
                    console.log(timeBreaks);
                    console.log('The clock has stopped!');
                }
            }
        }),
        timeBreaks = [],
        Spinner = function(spinnerObj, buttons) {
            var spinner = spinnerObj.spinner();
            this.disableSpinner = function() {
                if (spinner.spinner("option", "disabled")) {
                    spinner.spinner("enable");
                } else {
                    spinner.spinner("disable");
                }
            };
            this.getSpinnerValue = function() {
                return spinner.spinner("value");
            };
            this.setSpinnerValue = function(value) {
                spinner.spinner("value", value);
            };
        },
        minute = new Spinner(jQuery("#minute"), jQuery(".ui-spinner-button")),
        second = new Spinner(jQuery("#second"), jQuery(".ui-spinner-button"));
    clock.setTime(defaultTimerSeconds);
    $scope.defauleMatchTime = '180';
    $scope.Player1Score = 0;
    $scope.Player2Score = 0;
    console.log();
    $scope.matId = window.location.hash.split('dojoMat/')[1];
    $scope.toggleTimer = function() {
        clock.running ? clock.stop() : clock.start();
        console.log(clock.getElapsed()); ////////////////////////Working here
    }
    $scope.gameRunning = clock.running;
    $scope.increasePoint = function(playerNumber, points) {
        console.log('increase', playerNumber, points, $scope.Player1Score, $scope.Player2Score);
        if ($scope.gameRunning) {
            if (playerNumber === 1) {
                console.log('increases', playerNumber, points, $scope.Player1Score);
                $scope.Player1Score = $scope.Player1Score + points;
            } else if (playerNumber === 2) {
                console.log('increases', playerNumber, points, $scope.Player2Score);
                $scope.Player2Score = $scope.Player2Score + points;
            }
        }
    }
}
