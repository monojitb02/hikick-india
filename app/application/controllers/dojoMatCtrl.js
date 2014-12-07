'use strict';
var defaultTimerSeconds = 180,
    submitGracePeriod = 5000;
module.exports = function($scope, $http, $state, $timeout, $interval) {
    var clock = jQuery('.clock').FlipClock({
            countdown: true,
            autoStart: false,
            clockFace: 'MinuteCounter',
            callbacks: {
                start: function() {
                    $scope.gameRunning = !$scope.gameRunning;
                    $scope.matchStarted = true;
                    $scope.timeBreaks.push(new Date());
                },
                stop: function() {
                    $scope.gameRunning = !$scope.gameRunning;
                    $scope.timeBreaks.push(new Date());
                    if (clock.getTime().time === 0) {
                        console.log('ended');
                        freezeMatch();
                    }
                }
            }
        }),
        checkNumber = function(value) {
            if (isNaN(value)) {
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
            blockFreeze = false;
            $scope.showProgress = true;
            $interval(function() {
                $scope.pgrogressValue += (100 / 50);
            }, 100, 50)
            $timeout(function() {
                $scope.showProgress = false;
                $scope.pgrogressValue = 2;
                if (blockFreeze) {
                    blockFreeze = false;
                } else {
                    console.log('matchEnded');
                    $scope.matchEnded = true;
                }
            }, submitGracePeriod);
        },
        blockFreeze = false;


    $scope.warningArray = ['C', 'K', 'CH', 'H'];
    var array = [];
    for (var i = 1; i <= 53; i++) {
        array.push({
            name: String(i)
        });
    }
    $scope.eventIds = array;
    $scope.getMatches = function() {
        console.log('connecting to server');
    };

    $scope.selectedEvent = {};
    $scope.player1WarningArray1 = [];
    $scope.player1WarningArray2 = [];
    $scope.player2WarningArray1 = [];
    $scope.player2WarningArray2 = [];
    $scope.matchStarted = false;
    $scope.matchEnded = false;

    $scope.pgrogressValue = 2;
    $scope.Player1Score = 0;
    $scope.Player2Score = 0;
    $scope.Player1ScoreArray = [];
    $scope.Player2ScoreArray = [];
    $scope.timeBreaks = [];

    $scope.matId = window.location.hash.split('dojoMat/')[1];
    $scope.toggleTimer = function() {
        clock.running ? clock.stop() : clock.start();
    };
    $scope.setTimer = function() {
        clock.setTime($scope.timerMinute * 60 + $scope.timerSecond);
        blockFreeze = true;
        $scope.showProgress = false;
        $scope.pgrogressValue = 2;
    };
    $scope.resetTimer = function() {
        jQuery("#second").val('0');
        jQuery("#minute").val('3');
        $scope.timerMinute = 3;
        $scope.timerSecond = 0;
        $scope.setTimer();
        $scope.showProgress = false;
        $scope.pgrogressValue = 2;
    };
    $scope.gameRunning = clock.running;
    $scope.increasePoint = function(playerNumber, points) {
        if ($scope.matchStarted && !$scope.matchEnded) {
            if (playerNumber === 1) {
                $scope.Player1Score = $scope.Player1Score + points;
                $scope.Player1ScoreArray.push({
                    point: points,
                    time: new Date()
                });
            } else if (playerNumber === 2) {
                $scope.Player2Score = $scope.Player2Score + points;
                $scope.Player2ScoreArray.push({
                    point: points,
                    time: new Date()
                });
            }
        }
    };
    $scope.undo = function(player) {
        var popped;
        if ($scope.matchStarted && !$scope.matchEnded) {
            if (player === 1) {
                popped = $scope.Player1ScoreArray.pop();
                $scope.Player1Score = $scope.Player1Score - popped.point;
            } else if (player === 2) {
                popped = $scope.Player2ScoreArray.pop();
                $scope.Player2Score = $scope.Player2Score - popped.point;
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

        // console.log('toggleWarning', $scope.player1WarningArray1, $scope.player1WarningArray2, $scope.player2WarningArray1, $scope.player2WarningArray2)
    };
    $scope.submit = function() {

    };
    $scope.updateMatchList = function() {

    }

    $scope.resetTimer();
}
