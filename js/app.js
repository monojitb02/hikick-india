'use strict';
var mainModule = angular.module('hikick', ['ngRoute']);
mainModule
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/dashboard', {
                    templateUrl: 'templates/dashboard.html'
                })
                .when('/register-candidate', {
                    templateUrl: 'templates/register-candidate.html'
                })
                .when('/candidate-list', {
                    templateUrl: 'templates/candidate-list.html'
                })
                .when('/prepare-chart', {
                    templateUrl: 'templates/prepare-chart.html',
                    controller: 'chartPreperationController'
                })
                .when('/view-chart', {
                    templateUrl: 'templates/view-chart.html'
                })
                .when('/dojo-mat/:matId', {
                    templateUrl: 'templates/dojo-mat.html'
                })
                .when('/game-history', {
                    templateUrl: 'templates/game-history.html'
                })
                .otherwise({
                    redirectTo: '/dashboard'
                });
            //$locationProvider.html5Mode(true)
            /*.when('/Book/:bookId/ch/:chapterId', {
                templateUrl: 'chapter.html',
                controller: 'ChapterCtrl',
                controllerAs: 'chapter'
            });*/
            /*
                        $locationProvider.html5Mode(true);*/
        }
    ])
    .controller('mainController', ['$scope', '$route', function($scope, $route) {

        // Minimize Button in Panels
        jQuery('.minimize').click(function() {
            var t = jQuery(this);
            var p = t.closest('.panel');
            if (!jQuery(this).hasClass('maximize')) {
                p.find('.panel-body, .panel-footer').slideUp(200);
                t.addClass('maximize');
                t.html('&plus;');
            } else {
                p.find('.panel-body, .panel-footer').slideDown(200);
                t.removeClass('maximize');
                t.html('&minus;');
            }
            return false;
        });

        $scope.$on('$viewContentLoaded', function(event) {
            var originalHash = window.location.hash.replace(/\?.*$/, '');
            var activeListElement = jQuery('a[href="' + originalHash + '"]').closest("li");
            /*
                        var closeVisibleSubMenu = function() {
                            jQuery('.nav-parent').each(function() {
                                var t = jQuery(this);
                                if (t.hasClass('nav-active')) {
                                    t.find('> ul').slideUp(200, function() {});
                                }
                            });
                        };*/
            // closeVisibleSubMenu();


            if (jQuery('.nav-active').length &&
                !jQuery.contains(jQuery('.nav-active')[0], activeListElement[0])) {
                jQuery('.nav-active > ul').slideUp(200);
                jQuery('.nav-active').removeClass('nav-active');
            }

            //For only intra-sub menu 
            jQuery('.leftpanelinner li.active').removeClass('active');
            activeListElement.addClass('active');
            if (activeListElement.parents('ul').hasClass('children')) {
                activeListElement.parents('.nav-parent').addClass('active nav-active');
                activeListElement.parents('ul').slideDown(200);
            }

        });
    }])
    .controller('chartPreperationController', ['$scope', '$route', function($scope, $route) {

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
        $scope.$watch(function() {
            if (!$scope.renderingComplete) {
                $scope.renderingComplete = true;
                setTimeout(function() {
                    jQuery('.tags-input').tagsInput({
                        width: 'auto',
                        height: 'auto',
                        interactive: false,
                        onChange: function(element, tag) {
                            // console.log(element, tag);
                            var element = (element.length ? element[0] : element);
                            console.log(element.value);
                            var eventId = element.getAttribute('event-id');
                            // if (element[0].value.split(',').indexOf(tag))

                            for (var i = 0; i < data.length; i++) {
                                if (data[i].eventId === eventId) {
                                    data[i].candidatesGotBy = element.value.split(',');
                                }
                            }
                            console.log(data);
                        }
                    });
                }, 10);
            }
        })
        $scope.getGames = function() {
            return gameEvents;
        };
        $scope.getCandidatesGotBy = function(eventId) {
            var eventData = data.filter(function(element) {
                return element.eventId === eventId;
            })[0];
            return eventData.candidatesGotBy || [];
        }
        $scope.addToByList = function(event, eventId, maxBycount) {
            var target = event.target,
                candidateId = target.value,
                tagContainer = jQuery(target).closest(jQuery('.panel-body')).find('.tags-input'),
                candidatesGotBy = $scope.getCandidatesGotBy(eventId);
            if ((!candidateId) ||
                (candidatesGotBy.indexOf(candidateId) >= 0) ||
                (candidatesGotBy.length >= maxBycount)) {
                return;
            }
            tagContainer.addTag(candidateId);
            target.value = '';
            // tagContainer.addTag(target.value);
        };
    }]);
