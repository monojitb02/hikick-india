'use strict';
var lib = require('./lib'),
    /*
     *policies
     */
    userPolicy = require('./api/policies/userPolicy'),
    permissionPolicy = require('./api/policies/permissionPolicy'),
    /*
     *controllers
     */
    userController = require('./api/controllers/userController'),
    candidateController = require('./api/controllers/candidateController');
/*
 *utils
 */
// userUtils = require('./api/utils/userUtil');

module.exports = function(app) {

    //app.use(userPolicy.dummyLogin);
    app.use(userPolicy.authenticate); //check if the client has a proper session or not and append details of the logged in user to req.sender
    app.use('/api/:operation', permissionPolicy.verifyPermissions); //verify permissions for the operation

    //User Routes    
    app.post('/api/login', userController.login);
    app.post('/api/logout', userController.logout);
    app.get('/api/candidate/view', candidateController.view);
    // app.post('/api/candidate/add', candidateController.add);
    // app.put('/api/candidate/update', candidateController.update);
    // app.get('/api/candidate/search', candidateController.searchCandidate);
    // app.get('/api/candidate/get_clubs', candidateController.getClubs);
    // app.get('/api/temp_candidate/view', temp_candidateController.view);
    // app.get('/api/temp_candidate/search', temp_candidateController.searchCandidate);
};
