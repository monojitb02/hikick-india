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
                },
                stop: function() {
                    $scope.gameRunning = !$scope.gameRunning;
                    timeBreaks.push(new Date());
                }
            }
        }),
        timeBreaks = [],
        checkNumber = function(value) {
            if (isNaN(value)) {
                return 0;
            }
            if (isNaN(value)) {
                return 0;
            }
            if (Number(value) >= 60) {
                return 0;
            }
            if (Number(value) >= 60) {
                return 0;
            }
            return Number(value);
        },
        Spinner = function(spinnerObj, spinCallback) {
            var spinner = spinnerObj.spinner({
                spin: spinCallback
            });
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
        minute = new Spinner(jQuery("#minute"), function(event, ui) {
            $scope.timerMinute = checkNumber(ui.value);
            $scope.$apply();
        }),
        second = new Spinner(jQuery("#second"), function(event, ui) {
            $scope.timerSecond = checkNumber(ui.value);
            $scope.$apply();
        });


    // clock.setTime(defaultTimerSeconds);

    $scope.Player1Score = 0;
    $scope.Player2Score = 0;
    $scope.matId = window.location.hash.split('dojoMat/')[1];
    $scope.toggleTimer = function() {
        clock.running ? clock.stop() : clock.start();
    };
    $scope.setTimer = function() {
        clock.setTime($scope.timerMinute * 60 + $scope.timerSecond);
    };
    $scope.resetTimer = function() {
        jQuery("#second").val('0');
        jQuery("#minute").val('3');
        $scope.timerMinute = 3;
        $scope.timerSecond = 0;
        $scope.setTimer();
    };
    $scope.gameRunning = clock.running;
    $scope.increasePoint = function(playerNumber, points) {
        console.log('increase', playerNumber, points, $scope.timer, $scope.Player2Score);
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
    $scope.resetTimer();
}
