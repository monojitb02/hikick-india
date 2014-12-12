'use strict';
var api = require('../../util/api'),
    defaultTimerSeconds = 180,
    submitGracePeriod = 5000,
    shedules = [];
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
        getMaxPlayerPossible = function(originalNumber) {
            if (originalNumber === 1) {
                return 1;
            }
            return Math.pow(2, Math.ceil(Math.log(originalNumber) / Math.LN2));
        },
        getMaxLevel = function(shedules) {
            var maxLevel = 1;
            shedules.forEach(function(shedule) {
                if (shedule.currentLevel > maxLevel) {
                    maxLevel = shedule.currentLevel;
                }
            });
            return maxLevel;
        },
        getPlayersInLevel = function(players, level) {
            return players.filter(function(shedule) {
                return (shedule.currentLevel === level)
            });
        },
        expectedPlayersCountInLevel = function(shedules, level) {
            var maxPlayerPossible = getMaxPlayerPossible(shedules.length);
            return maxPlayerPossible / Math.pow(2, level - 1);
        },
        getCurrentLevel = function(shedules) {
            var maxLevel = getMaxLevel(shedules),
                playersInTopLevel = getPlayersInLevel(shedules, maxLevel).length,
                expectedPlayersInTopLevel = expectedPlayersCountInLevel(shedules, maxLevel);
            if (maxLevel === 1) {
                return maxLevel;
            } else if (playersInTopLevel === expectedPlayersInTopLevel) {
                return maxLevel;
            } else {
                return maxLevel - 1;
            }
        },
        getFixtures = function(shedules, currentLevel) {
            var fixtures = [],
                match = {},
                partecipants = shedules.filter(function(shedule) {
                    return (shedule.currentLevel === currentLevel);
                })
                /**/
                // console.log(currentLevel);
            partecipants.forEach(function(partecipant) {
                partecipant.orderNumber = Math.ceil(partecipant.secretSerialNumber / Math.pow(2, currentLevel - 1));
            });
            partecipants.sort(function(a, b) {
                if (a.orderNumber > b.orderNumber) {
                    return 1;
                } else {
                    return -1;
                }
            });
            for (var i = 0; i < partecipants.length; i++) {
                console.log(i, partecipants[i].orderNumber);
                if (partecipants[i].orderNumber % 2 === 1 &&
                    partecipants[(i + 1)] &&
                    partecipants[(i + 1)].orderNumber % 2 === 0) {
                    fixtures.push({
                        player1: partecipants[i].participant,
                        player2: partecipants[i + 1].participant
                    });
                }
            }
            return fixtures;
        },
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
                $scope.progressValue += (100 / 50);
            }, 100, 50)
            $timeout(function() {
                $scope.showProgress = false;
                $scope.progressValue = 2;
                if (blockFreeze) {
                    blockFreeze = false;
                } else {
                    console.log('matchEnded');
                    $scope.winner = $scope.player2Score > $scope.player1Score ? $scope.player2Score : $scope.player1Score;
                    $scope.matchEnded = true;
                }
            }, submitGracePeriod);
        },
        resetPage = function() {
            $scope.player1 = {};
            $scope.player1Name = '';
            $scope.player1WarningArray1 = [];
            $scope.player1WarningArray2 = [];
            $scope.player1Score = 0;
            $scope.player1ScoreArray = [];

            $scope.player2 = {};
            $scope.player2Name = '';
            $scope.player2WarningArray1 = [];
            $scope.player2WarningArray2 = [];
            $scope.player2Score = 0;
            $scope.player2ScoreArray = [];

            $scope.winner = {};
            $scope.timeBreaks = [];
            $scope.resetTimer();
            $scope.matchStarted = false;
            $scope.matchEnded = false;
            $scope.progressValue = 2;
            $scope.updateMatchList();
        },
        blockFreeze = false;

    $scope.toggleTimer = function() {
        clock.running ? clock.stop() : clock.start();
    };
    $scope.setTimer = function() {
        clock.setTime($scope.timerMinute * 60 + $scope.timerSecond);
        blockFreeze = true;
        $scope.showProgress = false;
        $scope.progressValue = 2;
    };
    $scope.resetTimer = function() {
        jQuery("#second").val('0');
        jQuery("#minute").val('3');
        $scope.timerMinute = 3;
        $scope.timerSecond = 0;
        $scope.setTimer();
        $scope.showProgress = false;
        $scope.progressValue = 2;
    };
    $scope.gameRunning = clock.running;
    $scope.increasePoint = function(playerNumber, points) {
        if ($scope.matchStarted && !$scope.matchEnded) {
            if (playerNumber === 1) {
                $scope.player1Score = $scope.player1Score + points;
                $scope.player1ScoreArray.push({
                    point: points,
                    time: new Date()
                });
            } else if (playerNumber === 2) {
                $scope.player2Score = $scope.player2Score + points;
                $scope.player2ScoreArray.push({
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
                popped = $scope.player1ScoreArray.pop();
                $scope.player1Score = $scope.player1Score - popped.point;
            } else if (player === 2) {
                popped = $scope.player2ScoreArray.pop();
                $scope.player2Score = $scope.player2Score - popped.point;
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
        var matchData;
        if (clock.running) {
            clock.stop();
        }
        $scope.winner = $scope.player2Score > $scope.player1Score ? $scope.player2 : $scope.player1;
        //console.log($scope.matId, $scope.player1, $scope.player1WarningArray1, $scope.player1WarningArray2, $scope.player1Score, $scope.player1ScoreArray, $scope.timeBreaks);
        //console.log($scope.matId, $scope.player2, $scope.player2WarningArray1, $scope.player2WarningArray2, $scope.player2Score, $scope.player2ScoreArray, $scope.timeBreaks);
        matchData = {
            date: new Date(),
            event: $scope.currentEvent._id,
            level: $scope.currentLevel,
            dojoNumber: Number($scope.matId),
            referee: $scope.referee,
            timeBreaks: $scope.timeBreaks,
            redCornerPlayer: $scope.player1._id,
            redCornerPoints: $scope.player1ScoreArray,
            redCornerWarnings1: $scope.player1WarningArray1,
            redCornerWarnings2: $scope.player1WarningArray2,
            blueCornerPlayer: $scope.player2._id,
            blueCornerPoints: $scope.player2ScoreArray,
            blueCornerWarnings1: $scope.player2WarningArray1,
            blueCornerWarnings2: $scope.player2WarningArray2,
            winner: $scope.winner._id
        };


        $http({
                url: api.addMatch,
                method: 'POST',
                data: matchData
            })
            .success(function(data) {
                if (data.success) {
                    resetPage();
                }
            })
            .error(function() {
                //TO_DO:show error message
            });
        console.log(matchData);

    };
    $scope.selectFixture = function(fixture) {
        $scope.player1 = fixture.player1;
        $scope.player2 = fixture.player2;
        $scope.player1Name = fixture.player1.name;
        $scope.player2Name = fixture.player2.name;
        $scope.showMatchList = false;
    };
    $scope.updateMatchList = function() {
        $scope.fixtureList = [];
        console.log($scope.currentEvent);
        if (!$scope.currentEvent) {
            return;
        }
        $http({
                url: api.getEventShedule,
                method: 'GET',
                params: {
                    event_id: $scope.currentEvent._id
                }
            })
            .success(function(data) {
                if (data.success) {
                    shedules = data.data;
                    $scope.currentLevel = getCurrentLevel(shedules);
                    $scope.fixtureList = getFixtures(shedules, $scope.currentLevel);
                }
                //TO_DO:show error message
            })
            .error(function() {
                //TO_DO:show error message
            });
    }
    $http({
            url: api.getEventList,
            method: 'GET'
        })
        .success(function(data) {
            if (data.success) {
                $scope.events = data.data;
            }
        })
        .error(function() {
            //TO_DO:show error message
        });


    $scope.warningArray = ['C', 'K', 'CH', 'H'];
    $scope.matId = window.location.hash.split('dojoMat/')[1];
    /*
        $scope.player1WarningArray1 = [];
        $scope.player1WarningArray2 = [];
        $scope.player2WarningArray1 = [];
        $scope.player2WarningArray2 = [];

        $scope.player1Score = 0;
        $scope.player2Score = 0;
        $scope.player1ScoreArray = [];
        $scope.player2ScoreArray = [];

        $scope.timeBreaks = [];
        $scope.matchStarted = false;
        $scope.matchEnded = false;
        $scope.progressValue = 2;

        $scope.resetTimer();
        $scope.updateMatchList();*/
    resetPage();
}
