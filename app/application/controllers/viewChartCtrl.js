'use strict';
var unitHeight = 25,
    /*getMaxPlayerPossible = function(originalNumber) {
        return Math.pow(2, Math.ceil(Math.log(originalNumber) / Math.log(2)));
    },*/

    shedules = [{
        event: 1,
        participant: {
            participantId: 1,
            name: 'number1'
        },
        currentLevel: 1,
        secretSerialNumber: 1,
        byFlag: false
    }, {
        event: 1,
        participant: {
            participantId: 9,
            name: 'number8'
        },
        currentLevel: 1,
        secretSerialNumber: 8,
        byFlag: true
    }, {
        event: 1,
        participant: {
            participantId: 2,
            name: 'number3'
        },
        currentLevel: 1,
        secretSerialNumber: 3,
        byFlag: false
    }, {
        event: 1,
        participant: {
            participantId: 3,
            name: 'number4'
        },
        currentLevel: 2,
        secretSerialNumber: 4,
        byFlag: false
    }, {
        event: 1,
        participant: {
            participantId: 4,
            name: 'number5'
        },
        currentLevel: 1,
        secretSerialNumber: 5,
        byFlag: true
    }, {
        event: 1,
        participant: {
            participantId: 5,
            name: 'number7'
        },
        currentLevel: 1,
        secretSerialNumber: 7,
        byFlag: false
    }],
    getMaxLevel = function(players) { //returns top current lavel from all players
        return players.reduce(function(topPlayer, currentPlayer) {
            return (topPlayer.currentLevel > currentPlayer.currentLevel) ? topPlayer : currentPlayer;
        }).currentLevel;
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
    getGroupsForLevel = function(levelId, players) {
        var playersInLevel,
            groups = [];
        if (levelId === 1) {
            playersInLevel = players;
        } else {
            playersInLevel = players.filter(function(player) {
                return (player.currentLevel >= levelId);
            });
        }
        for (var group = 0; group < playersInLevel.length / 2; group++) {
            groups.push({
                player1: playersInLevel[group * 2],
                player2: playersInLevel[group * 2 + 1]
            });
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
                groups: getGroupsForLevel(level, players)
            });
        }
        return formatioArray;
    };
module.exports = function($scope, $http, $state) {
    $scope.levels = getFormation(shedules);
    $scope.unitHeight = unitHeight;
    $scope.getHeight = function(levelId) {
        return (Math.pow(2, levelId) * unitHeight) + 'px';
    };
    $scope.getOffset = function(levelId, rowNumber) {
        if (rowNumber === 0) {
            return (Math.pow(2, (levelId - 1)) * unitHeight) + 'px';
        }
        return ((Math.pow(2, levelId) - 1) * unitHeight) + 'px';
    };

};
