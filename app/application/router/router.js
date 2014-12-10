'use strict';

var fs = require('fs');
var utility = require('../../util');

module.exports = function($stateProvider, $locationProvider, $urlRouterProvider) {
    //console.log('Starting app');
    $stateProvider
        .state('login', {
            url: '/login',
            template: fs.readFileSync(__dirname + '/../templates/signin.html'),
            controller: 'loginCtrl'
        })
        .state('app', {
            template: fs.readFileSync(__dirname + '/../templates/menu.html'),
            controller: 'mainFrameCtrl'
        })
        .state('app.home', {
            url: '/home',
            views: {
                'pages': {
                    template: fs.readFileSync(__dirname + '/../templates/home.html'),
                    controller: 'homeCtrl'
                }
            }
        })
        .state('app.registerCandidate', {
            url: '/registerCandidate',
            views: {
                'pages': {
                    template: fs.readFileSync(__dirname + '/../templates/registerCandidate.html'),
                    controller: 'registerCandidateCtrl'
                }
            }
        })
        .state('app.candidateList', {
            url: '/candidateList',
            views: {
                'pages': {
                    template: fs.readFileSync(__dirname + '/../templates/candidateList.html'),
                    controller: 'candidateListCtrl'
                }
            }
        })
        .state('app.editCandidate', {
            url: '/editCandidate',
            views: {
                'pages': {
                    template: fs.readFileSync(__dirname + '/../templates/editParticipant.html'),
                    controller: 'editParticipantCtrl'
                }
            }
        })
        .state('app.prepareChart', {
            url: '/prepareChart',
            views: {
                'pages': {
                    template: fs.readFileSync(__dirname + '/../templates/prepareChart.html'),
                    controller: 'prepareChartCtrl'
                }
            }
        })
        .state('app.viewChart', {
            url: '/viewChart',
            views: {
                'pages': {
                    template: fs.readFileSync(__dirname + '/../templates/viewChart.html'),
                    controller: 'viewChartCtrl'
                }
            }
        })
        .state('app.dojoMat', {
            url: '/dojoMat/:matId',
            views: {
                'pages': {
                    template: fs.readFileSync(__dirname + '/../templates/dojoMat.html'),
                    controller: 'dojoMatCtrl'
                }
            }
        })
        .state('app.gameHistory', {
            url: '/gameHistory',
            views: {
                'pages': {
                    template: fs.readFileSync(__dirname + '/../templates/gameHistory.html'),
                    controller: 'gameHistoryCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise(function($injector) {
        var $state = $injector.get('$state'),
            id = utility.getCookie('uid');
        if (id) {
            $state.go('app.home');
        } else {
            $state.go('login');
        }
    });
};
