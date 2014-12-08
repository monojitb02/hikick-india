"jquery": "js/jquery-1.10.2.min.js",
"jquery-ui": "js/jquery-ui-1.10.3.min.js",
"jquery-migrate": "js/jquery-migrate-1.2.1.min.js",
"bootstrap": "js/bootstrap.min.js",
"modernizr": "js/modernizr.min.js",
"jquery-sparkline": "js/jquery.sparkline.min.js",
"toggles": "js/toggles.min.js",
"retina": "js/retina.min.js",
"jquery-cookies": "js/jquery.cookies.js",

"": "js/jquery.autogrow-textarea.js",
"": "js/bootstrap-fileupload.min.js",
"": "js/bootstrap-timepicker.min.js",
"": "js/jquery.maskedinput.min.js",
"": "js/jquery.tagsinput.min.js",
"": "js/jquery.mousewheel.js",
"": "js/chosen.jquery.min.js",
"": "js/dropzone.min.js",
"": "js/colorpicker.js",

"": "js/morris.min.js",
"": "js/raphael-2.1.0.min.js",

"": "js/jquery.datatables.min.js",
"": "js/chosen.jquery.min.js",

"": "js/bootstrap-wizard.min.js",
"": "js/jquery.validate.min.js",


"": "js/wysihtml5-0.3.0.min.js",
"": "js/bootstrap-wysihtml5.js",
"": "js/ckeditor/ckeditor.js",
"": "js/ckeditor/adapters/jquery.js",

"custom": "js/custom.js",




<!-- 
"jquery": "js/jquery-1.10.2.min.js",
"jquery-ui": "js/jquery-ui-1.10.3.min.js",
"jquery-migrate": "js/jquery-migrate-1.2.1.min.js",
"bootstrap": "js/bootstrap.min.js",
"modernizr": "js/modernizr.min.js",
"jquery-sparkline": "js/jquery.sparkline.min.js",
"toggles": "js/toggles.min.js",
"retina": "js/retina.min.js",
"jquery-cookies": "js/jquery.cookies.js",

"custom": "js/custom.js", -->


require("jquery");
require("jquery-ui");
require("jquery-migrate");
require("bootstrap");
require("modernizr");
require("jquery-sparkline");
require("toggles");
require("retina");
require("jquery-cookies");
require("custom");

/*
<div id="tags_added">
  <ul ng-hide="!selectedParticipant.name" class="no-style">
    <li class="clearfix">
      <div class="clear-both">
        <div class="col-sm-2 clearfix">
          <img style="width: 100%" ng-src="{{selectedParticipant.profilePictureFile | url}}" onerror="this.onerror=null;this.src='./resources/images/user.png';">
        </div>
        <div class="col-sm-8 no-padding-left clearfix">
          <div>{{selectedParticipant.name | name}}</div>
          <span class="speaker-description">{{selectedParticipant.country}}</span>
          <span class="speaker-description" ng-show="selectedParticipant.state">,{{selectedParticipant.state}}</span>
          <span class="speaker-description">,{{selectedParticipant.clubName}}</span>
        </div>
        <div class="col-sm-2">
          <span class="close" title="Remove Participant" ng-click="removeParticipant()" data-btn-name="close_speaker_search">×</span>
        </div>
      </div>
    </li>
  </ul>
</div>

<input ng-hide="selectedParticipant.name" type="text" placeholder="Search Participant here..." ng-model="participantAutoSearch" ng-keyup="getManagerList()" class="form-control">

<div ng-hide="!participantAutoSearch.trim().length" class="tag-suggestion search-result-margin" ng-show="displayResult">
  <div class="search-result-close-block">
    <span class="search-result-close-text">Managers found :</span>
    <span class="close" title="Close search result" ng-click="closeSearchResult()">×</span>
  </div>
  <ul ng-hide="!participants.length" class="chosen-results no-style" role="menu">
    <li ng-repeat="participant in participants">
      <div class="clear-both">
        <div class="col-sm-2 clearfix">
          <img class="col-sm-12" ng-src="{{participant.profilePictureFile | url}}" onerror="this.onerror=null;this.src='./resources/images/user.png';">
        </div>
        <div class="col-sm-8 no-padding-left clearfix">
          <div>{{participant.name | name}}</div>
          <div>
            <span class="speaker-description">{{participant.country}}</span>
            <span class="speaker-description" ng-show="participant.state">,{{participant.state}}</span>
            <span class="speaker-description">,{{participant.clubName}}</span>
          </div>
        </div>
        <div class="col-sm-2">
          <button class="btn btn-primary add-button pull-right" ng-click="addParticipant($index)">Add</button>
        </div>
      </div>
    </li>
  </ul>
  <div id="no_speaker" ng-hide="participants.length" class="text-center">
    <span class="fa fa-spin fa-spinner"></span>
  </div>
</div>*/
newTodoApp.directive('todoEnter', function() {
    return function(scope, element, attrs) {
        element.bind('keyup', function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.todoEnter);
                });
                event.preventDefault();
            }
        });
    };
});



// <select>
//     <option value="" selected="">-Select-</option>
//     <option value="AN">Andaman and Nicobar Islands</option>
//     <option value="AP">Andhra Pradesh</option>
//     <option value="AR">Arunachal Pradesh</option>
//     <option value="AS">Assam</option>
//     <option value="BR">Bihar</option>
//     <option value="CH">Chandigarh</option>
//     <option value="CT">Chhattisgarh</option>
//     <option value="DN">Dadra and Nagar Haveli</option>
//     <option value="DD">Daman and Diu</option>
//     <option value="DL">Delhi</option>
//     <option value="GA">Goa</option>
//     <option value="GJ">Gujarat</option>
//     <option value="HR">Haryana</option>
//     <option value="HP">Himachal Pradesh</option>
//     <option value="JK">Jammu and Kashmir</option>
//     <option value="JR">Jharkhand</option>
//     <option value="KA">Karnataka</option>
//     <option value="KL">Kerala</option>
//     <option value="LD">Lakshadweep</option>
//     <option value="MP">Madhya Pradesh</option>
//     <option value="MH">Maharashtra</option>
//     <option value="MN">Manipur</option>
//     <option value="ML">Meghalaya</option>
//     <option value="MZ">Mizoram</option>
//     <option value="NL">Nagaland</option>
//     <option value="OR">Orissa</option>
//     <option value="PY">Pondicherry</option>
//     <option value="PB">Punjab</option>
//     <option value="RJ">Rajasthan</option>
//     <option value="SK">Sikkim</option>
//     <option value="TN">Tamil Nadu</option>
//     <option value="TE">Telangana</option>
//     <option value="TR">Tripura</option>
//     <option value="UL">Uttaranchal</option>
//     <option value="UP">Uttar Pradesh</option>
//     <option value="WB">West Bengal</option>
// </select>


{
    AN: 'Andaman and Nicobar Islands',
    AP: 'Andhra Pradesh',
    AR: 'Arunachal Pradesh',
    AS: 'Assam',
    BR: 'Bihar',
    CH: 'Chandigarh',
    CT: 'Chhattisgarh',
    DN: 'Dadra and Nagar Haveli',
    DD: 'Daman and Diu',
    DL: 'Delhi',
    GA: 'Goa',
    GJ: 'Gujarat',
    HR: 'Haryana',
    HP: 'Himachal Pradesh',
    JK: 'Jammu and Kashmir',
    JR: 'Jharkhand',
    KA: 'Karnataka',
    KL: 'Kerala',
    LD: 'Lakshadweep',
    MP: 'Madhya Pradesh',
    MH: 'Maharashtra',
    MN: 'Manipur',
    ML: 'Meghalaya',
    MZ: 'Mizoram',
    NL: 'Nagaland',
    OR: 'Orissa',
    PY: 'Pondicherry',
    PB: 'Punjab',
    RJ: 'Rajasthan',
    SK: 'Sikkim',
    TN: 'Tamil Nadu',
    TE: 'Telangana',
    TR: 'Tripura',
    UL: 'Uttaranchal',
    UP: 'Uttar Pradesh',
    WB: 'West Bengal'
}

{
    'Andaman and Nicobar Islands': 'AN',
    'Andhra Pradesh': 'AP',
    'Arunachal Pradesh': 'AR',
    'Assam': 'AS',
    'Bihar': 'BR',
    'Chandigarh': 'CH',
    'Chhattisgarh': 'CT',
    'Dadra and Nagar Haveli': 'DN',
    'Daman and Diu': 'DD',
    'Delhi': 'DL',
    'Goa': 'GA',
    'Gujarat': 'GJ',
    'Haryana': 'HR',
    'Himachal Pradesh': 'HP',
    'Jammu and Kashmir': 'JK',
    'Jharkhand': 'JR',
    'Karnataka': 'KA',
    'Kerala': 'KL',
    'Lakshadweep': 'LD',
    'Madhya Pradesh': 'MP',
    'Maharashtra': 'MH',
    'Manipur': 'MN',
    'Meghalaya': 'ML',
    'Mizoram': 'MZ',
    'Nagaland': 'NL',
    'Orissa': 'OR',
    'Pondicherry': 'PY',
    'Punjab': 'PB',
    'Rajasthan': 'RJ',
    'Sikkim': 'SK',
    'Tamil Nadu': 'TN',
    'Telangana': 'TE',
    'Tripura': 'TR',
    'Uttaranchal': 'UL',
    'Uttar Pradesh': 'UP',
    'West Bengal': 'WB'
}

var getIndexLimits = function(level, group, player) {
    var bandWidth = Math.pow(2, (level - 1)),
        threshold = 2 * (group - 1) + player;
    return (bandWidth * (threshold - 1), '<to=<', bandWidth * (threshold));
}
getPlayers = function(level, group, player) {
    var bandWidth = Math.pow(2, (level - 1)),
        threshold = 2 * (group - 1) + player,
        lowerLimit = bandWidth * (threshold - 1),
        upperLimit = bandWidth * (threshold),
        player = shedules.filter(function(player) {
            return (player.currentLevel >= level &&
                player.secretSerialNumber > lowerLimit &&
                player.secretSerialNumber <= upperLimit)
        });
    if (player.length > 1) {
        console.log('somthing fishy');
    }
    if (player.length) {
        return player[0];
    } else {
        return {};
    }
}



/*backup for viewChartController*/
// 'use strict';
// var unitHeight = 25,
//     /*getMaxPlayerPossible = function(originalNumber) {
//         return Math.pow(2, Math.ceil(Math.log(originalNumber) / Math.LN2));
//     },*/

//     shedules = [{
//         event: 1,
//         participant: {
//             participantId: 1,
//             name: 'number1'
//         },
//         currentLevel: 1,
//         secretSerialNumber: 1,
//         byFlag: false
//     }, {
//         event: 1,
//         participant: {
//             participantId: 9,
//             name: 'number8'
//         },
//         currentLevel: 1,
//         secretSerialNumber: 8,
//         byFlag: true
//     }, {
//         event: 1,
//         participant: {
//             participantId: 2,
//             name: 'number3'
//         },
//         currentLevel: 1,
//         secretSerialNumber: 3,
//         byFlag: false
//     }, {
//         event: 1,
//         participant: {
//             participantId: 3,
//             name: 'number4'
//         },
//         currentLevel: 2,
//         secretSerialNumber: 4,
//         byFlag: false
//     }, {
//         event: 1,
//         participant: {
//             participantId: 4,
//             name: 'number5'
//         },
//         currentLevel: 1,
//         secretSerialNumber: 5,
//         byFlag: true
//     }, {
//         event: 1,
//         participant: {
//             participantId: 5,
//             name: 'number7'
//         },
//         currentLevel: 1,
//         secretSerialNumber: 7,
//         byFlag: false
//     }],
//     getMaxLevel = function(players) { //returns top current lavel from all players
//         return players.reduce(function(topPlayer, currentPlayer) {
//             return (topPlayer.currentLevel > currentPlayer.currentLevel) ? topPlayer : currentPlayer;
//         }).currentLevel;
//     },
//     playerShortById = function(player1, player2) {
//         return (player1.secretSerialNumber > player2.secretSerialNumber) ? 1 : -1;
//     },
//     insertBy = function(players) {
//         var result = [];
//         players = players.sort(playerShortById);
//         for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
//             if (players[playerIndex].participant) {
//                 players[playerIndex] = {
//                     name: players[playerIndex].participant.name,
//                     participantId: players[playerIndex].participant.participantId,
//                     secretSerialNumber: players[playerIndex].secretSerialNumber,
//                     currentLevel: players[playerIndex].currentLevel,
//                     event: players[playerIndex].event
//                 };
//             }
//             if (players[playerIndex].secretSerialNumber % 2 === 1) {
//                 result.push(players[playerIndex], {});
//             } else {
//                 result[players[playerIndex].secretSerialNumber - 1] = players[playerIndex];
//             }
//         }
//         return result;
//     },
//     getGroupsForLevel = function(levelId, players) {
//         var playersInLevel,
//             groups = [];
//         if (levelId === 1) {
//             playersInLevel = players;
//         } else {
//             playersInLevel = players.filter(function(player) {
//                 return (player.currentLevel >= levelId);
//             });
//         }
//         for (var group = 0; group < playersInLevel.length / 2; group++) {
//             groups.push({
//                 player1: playersInLevel[group * 2],
//                 player2: playersInLevel[group * 2 + 1]
//             });
//         }
//         return groups;
//     },
//     getFormation = function(players) {
//         var maxLevel = getMaxLevel(players),
//             formatioArray = [];
//         players = insertBy(players);
//         for (var level = 1; level <= maxLevel; level++) {
//             formatioArray.push({
//                 levelId: level,
//                 groups: getGroupsForLevel(level, players)
//             });
//         }
//         return formatioArray;
//     },
//     //TO_DO:have to test and implement it 
//     getPlayers = function(level, group, player) {
//         var bandWidth = Math.pow(2, (level - 1)),
//             threshold = 2 * (group - 1) + player,
//             lowerLimit = bandWidth * (threshold - 1),
//             upperLimit = bandWidth * (threshold),
//             player = shedules.filter(function(player) {
//                 return (player.currentLevel >= level &&
//                     player.secretSerialNumber > lowerLimit &&
//                     player.secretSerialNumber <= upperLimit)
//             });
//         if (player.length > 1) {
//             console.log('somthing fishy');
//         }
//         if (player.length) {
//             return player[0];
//         } else {
//             return {};
//         }
//     };
// module.exports = function($scope, $http, $state) {
//     $scope.levels = getFormation(shedules);
//     $scope.unitHeight = unitHeight;
//     $scope.getHeight = function(levelId) {
//         return (Math.pow(2, levelId) * unitHeight) + 'px';
//     };
//     $scope.getOffset = function(levelId, rowNumber) {
//         if (rowNumber === 0) {
//             return (Math.pow(2, (levelId - 1)) * unitHeight) + 'px';
//         }
//         return ((Math.pow(2, levelId) - 1) * unitHeight) + 'px';
//     };

// };









var participantList = [{
    "participantId": 13,
    "clubName": "MARTIAL ARTS OF SPORTS KARATE ASSOCIATION"
}, {
    "participantId": 1,
    "clubName": "MARTIAL OF SPORTS KARATE ASSOCIATION"
}, {
    "participantId": 5,
    "clubName": "MARTIAL ARTS OF SPORTS KARATE ASSOCIATION"
}]
var getMaxPlayerPossible = function(originalNumber) {
    if (originalNumber === 1) {
        return 1;
    }
    return Math.pow(2, Math.ceil(Math.log(originalNumber) / Math.LN2));
};
var getFixtures = function(participants, participantsGotBy) {
    var maximumSerialNo = getMaxPlayerPossible(participants.length),
        secretSerialNo1,
        secretSerialNo2,
        player1,
        player2,
        possiblePlayer2array = [],
        resultArray = [],
        hasGotBy = function(participant) {
            return participantsGotBy.filter(function(playerGotby) {
                return playerGotby.participantId === participant.participantId;
            }).length;
        };
    console.log('maximumSerialNo', maximumSerialNo);
    /* if (!participants.length) {
        return [];
    }
*/
    for (var groupId = 0; groupId < (maximumSerialNo / 2); groupId++) {
        secretSerialNo1 = groupId * 2 + 1;
        secretSerialNo2 = secretSerialNo1 + 1;

        player1 = participants.splice(Math.floor((Math.random() * participants.length)), 1)[0];
        console.log('groupId', groupId, 'player1', player1);
        if (hasGotBy(player1)) {
            console.log('player1 got by in grpid', groupId, 'player', player1);
            player1.byFlag = true;
            player1.secretSerialNo = secretSerialNo1;
            resultArray.push(player1);
        } else {
            possiblePlayer2array = participants.filter(function(player2) {
                //return participant.clubName.trim().toUpperCase() !== player1.clubName.trim().toUpperCase();
                if (!hasGotBy(player2) && player2.clubName !== player1.clubName) {
                    return true;
                }
            });
            console.log('groupId', groupId, 'possiblePlayer2array', possiblePlayer2array);
            // TO_DO : have to check player 2 is in by list or not 

            if (!possiblePlayer2array.length) {
                possiblePlayer2array = participants.filter(function(player2) {
                    return !hasGotBy(player2)
                });
            }
            player2 = possiblePlayer2array.splice(Math.floor(Math.random() * possiblePlayer2array.length), 1)[0];
            participants = participants.filter(function(participant) {
                return participant.participantId !== player2.participantId;
            });
            console.log('player2', player2);
            player1.secretSerialNo = secretSerialNo1;
            resultArray.push(player1);
            player2.secretSerialNo = secretSerialNo2;
            resultArray.push(player2);
        }
    }
    return resultArray;
};
getFixtures(participantList, [{
    participantId: 13
}]);



maximumSerialNo 4
VM441: 45 groupId 0 player1 Object {
    participantId: 1,
    clubName: "MARTIAL OF SPORTS KARATE ASSOCIATION"
}
VM441: 58 groupId 0 possiblePlayer2array[]
VM441: 68 player2 Object {
    participantId: 13,
    clubName: "MARTIAL ARTS OF SPORTS KARATE ASSOCIATION"
}
VM441: 45 groupId 1 player1 Object {
    participantId: 5,
    clubName: "MARTIAL ARTS OF SPORTS KARATE ASSOCIATION"
}
VM441: 58 groupId 1 possiblePlayer2array[]
VM441: 68 player2 Object {
        participantId: 5,
        clubName: "MARTIAL ARTS OF SPORTS KARATE ASSOCIATION"
    }
    [Object, Object, Object, Object]
