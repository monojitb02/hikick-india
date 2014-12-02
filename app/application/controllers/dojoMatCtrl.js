'use strict';
var defaultTimerSeconds = 180,
    submitGracePeriod = 5000;
module.exports = function($scope, $http, $state, $timeout) {
    var clock = jQuery('.clock').FlipClock({
            countdown: true,
            autoStart: false,
            clockFace: 'MinuteCounter',
            callbacks: {
                start: function() {
                    $scope.gameRunning = !$scope.gameRunning;
                    $scope.matchStarted = true;
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
        }),
        resetAll = function() { //reset everything

        },
        freezeMatch = function() {
            $timeout(function() {
                $scope.matchEnded = true;
            }, submitGracePeriod)
        };


    $scope.warningArray = ['C', 'K', 'CH', 'H'];
    $scope.player1WarningArray1 = [];
    $scope.player1WarningArray2 = [];
    $scope.player2WarningArray1 = [];
    $scope.player2WarningArray2 = [];
    $scope.matchStarted = false;
    $scope.matchEnded = false;


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
        if ($scope.matchStarted && !$scope.matchEnded) {
            if (playerNumber === 1) {
                console.log('increases', playerNumber, points, $scope.Player1Score);
                $scope.Player1Score = $scope.Player1Score + points;
            } else if (playerNumber === 2) {
                console.log('increases', playerNumber, points, $scope.Player2Score);
                $scope.Player2Score = $scope.Player2Score + points;
            }
        }
    };
    $scope.toggleWarning = function(warning, player, warningLevel) {
        var idx;
        if (player === 1 && warningLevel === 1) {
            idx = $scope.player1WarningArray1.indexOf(warning);
            if (idx > -1) {
                $scope.player1WarningArray1.splice(idx, 1);
            } else {
                $scope.player1WarningArray1.push(warning);
            }
        } else if (player === 1 && warningLevel === 2) {
            idx = $scope.player1WarningArray2.indexOf(warning);
            if (idx > -1) {
                $scope.player1WarningArray2.splice(idx, 1);
            } else {
                $scope.player1WarningArray2.push(warning);
            }

        } else if (player === 2 && warningLevel === 1) {
            idx = $scope.player2WarningArray1.indexOf(warning);
            if (idx > -1) {
                $scope.player2WarningArray1.splice(idx, 1);
            } else {
                $scope.player2WarningArray1.push(warning);
            }

        } else if (player === 2 && warningLevel === 2) {
            idx = $scope.player2WarningArray2.indexOf(warning);
            if (idx > -1) {
                $scope.player2WarningArray2.splice(idx, 1);
            } else {
                $scope.player2WarningArray2.push(warning);
            }
        }
        console.log(clock.getTime().time);
        // console.log('toggleWarning', $scope.player1WarningArray1, $scope.player1WarningArray2, $scope.player2WarningArray1, $scope.player2WarningArray2)
    };
    $scope.submit = function() {
        freezeMatch();
    }

    $scope.resetTimer();
}
