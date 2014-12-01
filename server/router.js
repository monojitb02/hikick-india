'use strict';
var lib = require('./lib'),
    multiparty = lib.multiparty({
        limit: 10 + 'mb',
        uploadDir: './temp'
    }),
    /*
     *policies
     */
    userPolicy = require('./api/policies/userPolicy'),
    permissionPolicy = require('./api/policies/permissionPolicy'),
    /*
     *controllers
     */
    userController = require('./api/controllers/userController'),
    /*
     *utils
     */
    userUtils = require('./api/utils/userUtil');

module.exports = function(app) {

    //app.use(userPolicy.dummyLogin);
    app.use(userPolicy.authenticate); //check if the client has a proper session or not
    app.use(userPolicy.populateUserDetails); //append details of the logged in user to req.sender
    app.use('/api/:path/:operation', permissionPolicy.verifyPermissions); //verify permissions for the operation

    //User Routes    
    app.post('/api/login', userController.login);
    app.post('/api/logout', userController.logout);
    app.get('/api/candidate/view', userController.view);
    app.post('/api/candidate/add', multiparty, userController.add);
    app.put('/api/candidate/update', multiparty, userController.update);
    app.get('/api/candidate/search', userController.searchCandidate);
};
