'use strict';
var unitHeight = 25,
    /*getMaxPlayerPossible = function(originalNumber) {
        return Math.pow(2, Math.ceil(Math.log(originalNumber) / Math.log(2)));
    },*/
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
            if (players[playerIndex].secretSerialNumber % 2 === 1) {
                result.push(players[playerIndex], {});
            } else {
                result[players[playerIndex].secretSerialNumber - 1] = players[playerIndex];
            }
        }
        return result;
    },
    getGroupsForLevel = function(levelId, players) {
        var playersInLevel = players.filter(function(player) {
                return (player.currentLevel >= levelId);
            }),
            groups = [];
        for (group = 0; group < playersInLevel.length / 2; group++) {
            groups.push({
                player1: playersInLevel[group * 2],
                player2: playersInLevel[group * 2 + 1]
            });
        }
        return groups;
    };
module.exports = function($scope, $http, $state) {
    $scope.levels = [{
        levelId: 1,
        groups: [{
            player1: {
                name: 'mono',
                pcrticipantId: 1
            },
            player2: {
                name: 'anjan',
                pcrticipantId: 2
            }
        }, {
            player1: {
                name: 'arup',
                pcrticipantId: 3
            },
            player2: {
                name: 'sumon',
                pcrticipantId: 4
            }
        }]
    }, {
        levelId: 2,
        groups: [{
            player1: {
                name: 'mono',
                pcrticipantId: 1
            },
            player2: {
                name: 'arup',
                pcrticipantId: 3
            }
        }]
    }, {
        levelId: 3,
        groups: [{
            player1: {
                name: 'mono',
                pcrticipantId: 1
            }
        }]
    }];
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
