'use strict';

module.exports = function($scope, $http, $state) {
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
    var data = [{
        eventName: 'kata',
        eventId: 1,
        ageLimit: {
            upper: 5,
            lower: 2
        },
        weightLimit: {
            upper: 5,
            lower: 2
        },
        pending: false,
        candidatesGotBy: [23]
    }, {
        eventName: 'kata',
        eventId: 3,
        ageLimit: {
            upper: 10,
            lower: 2
        },
        weightLimit: {
            upper: 7,
            lower: 2
        },
        pending: false
    }, {
        eventName: 'kumite',
        eventId: 2,
        ageLimit: {
            upper: 5,
            lower: 2
        },
        weightLimit: {
            upper: 5,
            lower: 2
        },
        pending: true
    }, {
        eventName: 'kata',
        eventId: 4,
        ageLimit: {
            upper: 10,
            lower: 2
        },
        weightLimit: {
            upper: 7,
            lower: 2
        },
        pending: false
    }, {
        eventName: 'weapons',
        eventId: 6,
        ageLimit: {
            upper: 5,
            lower: 2
        },
        weightLimit: {
            upper: 5,
            lower: 2
        },
        pending: true
    }];

    var games = [],
        ressult,
        gameEvents = [],
        events,
        hasOdds,
        groupsCount;
    for (var i = 0; i < data.length; i++) {
        if (games.indexOf(data[i].eventName) === -1) {
            games.push(data[i].eventName);
        }
    }
    for (var gameIndex = 0; gameIndex < games.length; gameIndex++) {
        events = data.filter(function(event) {
            return (event.eventName === games[gameIndex]);
        });
        hasOdds = events.length % 2;
        groupsCount = Math.floor(events.length / 2);
        ressult = {
            eventName: games[gameIndex],
            events: []
        };
        for (var i = 0; i < groupsCount; i++) {
            ressult.events.push([events[(i * 2)], events[(i * 2 + 1)]]);
        }
        if (hasOdds) {
            ressult.events.push([events[(groupsCount * 2)]]);
        }
        gameEvents.push(ressult);
    }
    $scope.getGames = function() {
        return gameEvents;
    };
    $scope.getCandidatesGotBy = function(eventId) {
        var eventData = data.filter(function(element) {
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
}
