'use strict';
var api = require('../../util/api');
module.exports = function($scope, $http, $state) {
    var sheduleStatus = [],
        result,
        gameEvents = [],
        events,
        groupsCount,
        refreshSheduleStatus = function(sheduleStatus) {
            var games = [],
                hasOdds,
                eventsFormations = [];
            for (var i = 0; i < sheduleStatus.length; i++) {
                if (games.indexOf(sheduleStatus[i].eventName) === -1) {
                    games.push(sheduleStatus[i].eventName);
                }
            }
            for (var gameIndex = 0; gameIndex < games.length; gameIndex++) {
                events = sheduleStatus.filter(function(event) {
                    return (event.eventName === games[gameIndex]);
                });
                hasOdds = events.length % 2;
                groupsCount = Math.floor(events.length / 2);
                result = {
                    eventName: games[gameIndex],
                    events: []
                };
                for (var i = 0; i < groupsCount; i++) {
                    result.events.push([events[(i * 2)], events[(i * 2 + 1)]]);
                }
                if (hasOdds) {
                    result.events.push([events[(groupsCount * 2)]]);
                }
                eventsFormations.push(result);
            }
            return eventsFormations;
        };

    // Minimize Button in Panels
    $scope.slidePanel = function(event) {
        var target = event.target,
            docHeight;
        var t = jQuery(target);
        var p = t.closest('.panel');
        if (!jQuery(target).hasClass('maximize')) {
            p.find('.panel-body, .panel-footer').slideUp(200);
            t.addClass('maximize');
        } else {
            p.find('.panel-body, .panel-footer').slideDown(200);
            t.removeClass('maximize');
        }

        // Adjust mainpanel heightss
        docHeight = jQuery(document).height();
        if (docHeight > jQuery('.mainpanel').height())
            jQuery('.mainpanel').height(docHeight);
    };


    $scope.searchCandidates = function(query, eventId) {
        return $http.get('/api/shedule/search_participant?query=' + query + '&eventId=' + eventId);
    };
    $scope.getWeightLimit = function(event) {
        if (event.weightLimitUpper === 1000 && event.weightLimitLower === 0) {
            return 'N/A';
        }
        if (event.weightLimitUpper === 1000) {
            return 'above ' + event.weightLimitLower + ' kg';
        } else {
            return 'under ' + event.weightLimitUpper + ' kg';
        }
    };
    $scope.getAgeLimit = function(event) {
        if (event.ageLimitUpper === 1000 && event.ageLimitLower === 0) {
            return 'N/A';
        }
        if (event.ageLimitUpper === 1000) {
            return 'above ' + event.ageLimitLower + ' Years';
        } else {
            return 'under ' + event.ageLimitUpper + ' Years';
        }
    };

    $scope.submitShedule = function(event, index1, index2, index3) {
        var candidatesGotBy = [];
        if (event.candidatesGotBy &&
            event.candidatesGotBy.length !== 0 &&
            event.candidatesGotBy.length <= event.maximumByCount) {
            event.candidatesGotBy.forEach(function(candidate) {
                var participantId = candidate.text.split('ID:')[1];
                candidatesGotBy.push({
                    participantId: Number(participantId)
                });
            })
        }
        $http({
                url: api.sheduleEvent,
                method: 'PUT',
                data: {
                    eventId: event.eventId,
                    candidateGiveBy: candidatesGotBy
                }
            })
            .success(function(data) {
                gameEvents = refreshSheduleStatus(data.data);
                $scope.gameEvents[index1].events[index2][index3] = gameEvents[index1].events[index2][index3];
            })
            .error(function(err) {
                console.log(err);
            });
    }
    $http({
            url: api.sheduleSatus,
            method: 'GET'
        })
        .success(function(data) {
            if (data.success) {
                gameEvents = refreshSheduleStatus(data.data);
                $scope.gameEvents = gameEvents;
            }
        })
        .error(function(data, status, headers, config) {
            //TO_DO:show error message
        });
}
