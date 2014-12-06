'use strict';

module.exports = function($scope, $http, $state) {
    var sheduleStatus = [],
        result,
        gameEvents = [],
        events,
        groupsCount;
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
    $http.get('/api/shedule/status')
        .success(function(data, status, headers, config) {
            var games = [],
                hasOdds;
            if (data.success) {
                sheduleStatus = data.data;
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
                    gameEvents.push(result);
                }
            }
        })
        .error(function(data, status, headers, config) {
            //TO_DO:show error message
        });

    $scope.getGames = function() {
        return gameEvents;
    };
    $scope.getCandidatesGotBy = function(eventId) {
        var eventData = sheduleStatus.filter(function(element) {
            return element.eventId === eventId;
        })[0];
        return eventData.candidatesGotBy || [];
    };
    $scope.tags = [{
        text: 'just'
    }, {
        text: 'some'
    }, {
        text: 'cool'
    }, {
        text: 'tags'
    }];

    // $scope.tags = ['just', 'some', 'cool', 'tags'];
    $scope.loadCandidates = function(query, eventId) {
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
    }
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
}
