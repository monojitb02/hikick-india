'use strict';

require('./directives');
require('./services');
var App = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngTagsInput', 'app.directive', 'app.service'])
    .controller('mainFrameCtrl', require('./controllers/mainFrameCtrl'))
    .controller('loginCtrl', require('./controllers/loginCtrl'))
    .controller('homeCtrl', require('./controllers/homeCtrl'))
    .controller('registerCandidateCtrl', require('./controllers/registerCandidateCtrl'))
    .controller('candidateListCtrl', require('./controllers/candidateListCtrl'))
    .controller('prepareChartCtrl', require('./controllers/prepareChartCtrl'))
    .controller('viewChartCtrl', require('./controllers/viewChartCtrl'))
    .controller('dojoMatCtrl', require('./controllers/dojoMatCtrl'))
    .controller('gameHistoryCtrl', require('./controllers/gameHistoryCtrl'))
    .controller('registrationModalCtrl', require('./controllers/registrationModalCtrl'))
    .controller('viewParticipantModalCtrl', require('./controllers/viewParticipantModalCtrl'))
    .controller('deleteParticipantModalCtrl', require('./controllers/deleteParticipantModalCtrl'))
    .controller('editParticipantCtrl', require('./controllers/editParticipantCtrl'))
    .config(require('./router/router'));

module.exports = App;
