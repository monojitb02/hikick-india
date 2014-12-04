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
    participantController = require('./api/controllers/participantController'),
    tempParticipantController = require('./api/controllers/tempParticipantController');
/*
 *utils
 */
// userUtils = require('./api/utils/userUtil');

module.exports = function(app) {

    app.use(userPolicy.dummyLogin);
    app.use(userPolicy.authenticate); //check if the client has a proper session or not and append details of the logged in user to req.sender
    app.use('/api/:operation', permissionPolicy.verifyPermissions); //verify permissions for the operation


    //User Routes    
    app.post('/api/login', userController.login);
    app.post('/api/logout', userController.logout);

    app.get('/api/participant/view', participantController.view);
    // app.post('/api/participant/add', participantController.add);
    // app.put('/api/participant/update', participantController.update);
    // app.get('/api/participant/search', participantController.search);
    // app.get('/api/participant/get_clubs', participantController.getClubs);
    app.get('/api/temp_participant/search', tempParticipantController.search);
    app.get('/api/temp_participant/find', tempParticipantController.getParticipant);
    app.get('/api/temp_participant/list', tempParticipantController.getAllParticipant);

};
