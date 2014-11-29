'use strict';
var App = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngTagsInput']) //, 'app.home', 'app.search', 'app.player'
    .controller('mainFrameCtrl', require('./controllers/mainFrameCtrl'))
    .controller('loginCtrl', require('./controllers/loginCtrl'))
    .controller('homeCtrl', require('./controllers/homeCtrl'))
    .controller('registerCandidateCtrl', require('./controllers/registerCandidateCtrl'))
    .controller('candidateListCtrl', require('./controllers/candidateListCtrl'))
    .controller('prepareChartCtrl', require('./controllers/prepareChartCtrl'))
    .controller('viewChartCtrl', require('./controllers/viewChartCtrl'))
    .controller('dojoMatCtrl', require('./controllers/dojoMatCtrl'))
    .controller('gameHistoryCtrl', require('./controllers/gameHistoryCtrl'))
    .config(require('./router/router'));

module.exports = App;
