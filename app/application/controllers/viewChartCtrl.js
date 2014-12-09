'use strict';

var api = require('../../util/api'),
    unitHeight = 25,
    completeShedule = [],
    /*
        getMaxPlayerPossible = function(originalNumber) {
            return Math.pow(2, Math.ceil(Math.log(originalNumber) / Math.LN2));
        },
    */

    getEvents = function(shedules) {
        var events = [];
        shedules.forEach(function(shedule) {
            if (events.indexOf(shedule.event) < 0) {
                events.push(shedule.event);
            }
        });
        return events;
    },
    getMaxLevel = function(players) { //returns top current lavel from all players
        return Math.ceil(Math.log(players.length) / Math.LN2) + 1;
    },
    playerShortById = function(player1, player2) {
        return (player1.secretSerialNumber > player2.secretSerialNumber) ? 1 : -1;
    },
    insertBy = function(players) {
        var result = [];
        players = players.sort(playerShortById);
        for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
            if (players[playerIndex].participant) {
                players[playerIndex] = {
                    name: players[playerIndex].participant.name,
                    participantId: players[playerIndex].participant.participantId,
                    secretSerialNumber: players[playerIndex].secretSerialNumber,
                    currentLevel: players[playerIndex].currentLevel,
                    event: players[playerIndex].event
                };
            }
            if (players[playerIndex].secretSerialNumber % 2 === 1) {
                result.push(players[playerIndex], {});
            } else {
                result[players[playerIndex].secretSerialNumber - 1] = players[playerIndex];
            }
        }
        return result;
    },
    getGroupsForLevel = function(players, level, maxLevel) {
        var groups = [];
        if (level === maxLevel) {
            groups.push({
                player1: getPlayers(players, level, group, 1),
                player2: {},
            });
        } else {
            for (var group = 1; group <= Math.pow(2, maxLevel - level - 1); group++) {
                groups.push({
                    player1: getPlayers(players, level, group, 1),
                    player2: getPlayers(players, level, group, 2),
                });
            }
        }
        return groups;
    },
    getFormation = function(players) {
        var maxLevel = getMaxLevel(players),
            formatioArray = [];
        players = insertBy(players);
        for (var level = 1; level <= maxLevel; level++) {
            formatioArray.push({
                levelId: level,
                groups: getGroupsForLevel(players, level, maxLevel)
            });
        }
        // console.log(formatioArray);
        return formatioArray;
    },
    //TO_DO:have to test and implement it 
    getPlayers = function(players, level, group, player) {
        var bandWidth = Math.pow(2, (level - 1)),
            threshold = 2 * (group - 1) + player,
            lowerLimit = bandWidth * (threshold - 1),
            upperLimit = bandWidth * (threshold),
            result = players.filter(function(player) {
                return (player.currentLevel >= level &&
                    player.secretSerialNumber > lowerLimit &&
                    player.secretSerialNumber <= upperLimit)
            });
        if (result.length > 1) {
            console.log('somthing fishy');
        }
        if (result.length) {
            return result[0];
        } else {
            return {};
        }
    };
module.exports = function($scope, $http, $state) {
    $scope.unitHeight = unitHeight;
    $scope.isLastLevel = function(levelId) {
        return levelId === getMaxLevel($scope.shedules);
    };
    $scope.getHeight = function(levelId) {
        return (Math.pow(2, levelId) * unitHeight) + 'px';
    };
    $scope.getOffset = function(levelId, rowNumber) {
        if (rowNumber === 0) {
            return (Math.pow(2, (levelId - 1)) * unitHeight) + 'px';
        }
        return ((Math.pow(2, levelId) - 1) * unitHeight) + 'px';
    };
    $scope.currentEvent = 1;
    $scope.itemsPerPage = 1;
    $http({
            url: api.getAllShedule,
            method: 'GET'
        })
        .success(function(data) {
            if (data.success) {
                completeShedule = data.data;
                $scope.events = getEvents(completeShedule);
                $scope.$watch('currentEvent', function() {
                    $scope.shedules = completeShedule.filter(function(shedule) {
                        return shedule.event === $scope.events[$scope.currentEvent - 1];
                    });
                    $scope.levels = getFormation($scope.shedules);
                });
            }
        })
        .error(function() {
            //TO_DO:show error message
        });
    /*
        $scope.events = getEvents(completeShedule);
        $scope.$watch('currentEvent', function() {
            $scope.shedules = completeShedule.filter(function(shedule) {
                return shedule.event === $scope.events[$scope.currentEvent - 1];
            });
            $scope.levels = getFormation($scope.shedules);
        });*/
};
