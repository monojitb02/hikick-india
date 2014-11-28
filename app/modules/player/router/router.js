'use strict';
var fs = require('fs');

module.exports = function($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.registerCandidate', {
            url: '/register-candidate',
            views: {
                'pages': {
                    template: fs.readFileSync(__dirname + '/../templates/register-candidate.html'),
                    controller: 'registerCandidatesCtrl'
                }
            }
        });
}
