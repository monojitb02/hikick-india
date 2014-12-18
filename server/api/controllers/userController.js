/**
 * userController
 *
 */
'use strict';
var lib = require('../../lib'),
    q = lib.q,
    md5 = lib.md5,
    userModel = require('../models/user'),
    utils = require('../utils');

module.exports = {
    /**
     * UserController.login()
     */
    login: function(req, res) {
        var email,
            password,
            clientip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            workflow = lib.workflow(req, res);
        console.log('login attempt from :' + clientip + ' on ' + new Date());
        if (req.session.userId) {
            workflow.outcome.errfor.message = lib.message.ALREADY_LOGGED_IN;
            workflow.emit('response');
        } else if (req.body.email !== undefined &&
            req.body.password !== undefined &&
            req.body.secure !== undefined) {
            email = req.body.email;
            password = req.body.password;
            if (req.body.secure === 'false' ||
                req.body.secure === false) {
                password = md5(password);
            }
            userModel
                .findOne({
                    'email': email,
                    'password': password
                }, '-password')
                .exec(function(err, data) {
                    if (err) {
                        workflow.emit('exception', err);
                    } else if (data) {
                        req.session.userId = data._id;
                        workflow.outcome.data = data;
                        workflow.emit('response');
                    } else {
                        workflow.outcome.errfor.message = lib.message.AUTHENTICATION_FAILED;
                        workflow.emit('response');
                    }
                });
        } else {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
        }
    },
    logout: function(req, res) {
        var workflow = lib.workflow(req, res),
            clientip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('logout attempt from :' + clientip + ' on ' + new Date());
        req.session.destroy(function() {
            workflow.outcome.errfor.message = lib.message.LOGOUT_FAILED;
        });
        workflow.emit('response');
    }

};
