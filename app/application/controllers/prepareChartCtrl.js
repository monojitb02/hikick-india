'use strict';

module.exports = function($scope, $http, $state) {
    var sheduleStatus = [];
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

    jQuery('#tags').tagsInput({
        width: 'auto',
        height: 'auto',
        interactive: false
    });
    /*    var sheduleStatus = [{
            eventName: 'kata',
            eventId: 1,
            ageLimitUpper: 5,
            ageLimitLower: 2,
            weightLimitUpper: 5,
            weightLimitLower: 2,
            pending: false,
            candidatesGotBy: [23],
            maximumByCount: 5
        }, {
            eventName: 'kata',
            eventId: 3,
            ageLimitUpper: 5,
            ageLimitLower: 2,
            weightLimitUpper: 5,
            weightLimitLower: 2,
            pending: false
        }, {
            eventName: 'kumite',
            eventId: 2,
            ageLimitUpper: 5,
            ageLimitLower: 2,
            weightLimitUpper: 5,
            weightLimitLower: 2,
            pending: true
        }, {
            eventName: 'kata',
            eventId: 4,
            ageLimitUpper: 1000,
            ageLimitLower: 2,
            weightLimitUpper: 7,
            weightLimitLower: 2,
            pending: false
        }, {
            eventName: 'weapons',
            eventId: 6,
            ageLimitUpper: 1000,
            ageLimitLower: 32,
            weightLimitUpper: 5,
            weightLimitLower: 2,
            pending: true
        }];
    */
    $http.get('/api/shedule/status')
        .success(function(data, status, headers, config) {
            if (data.success) {
                sheduleStatus = data.data;
            }
        })
        .error(function(data, status, headers, config) {

        });

    var games = [],
        result,
        gameEvents = [],
        events,
        hasOdds,
        groupsCount;
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
    $scope.loadCandidates = function(query) {
        return ['a', 'b'];
    };
    $scope.getWeightLimit = function(event) {
        return
    }
}
