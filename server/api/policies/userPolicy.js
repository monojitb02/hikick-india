/**
 * common policies
 *
 */
'use strict';
var lib = require('../../lib'),
    roleModel = require('../models/role'),
    userModel = require('../models/user');

module.exports = {
    dummyLogin: function(req, res, next) {
        userModel.findOne({
                _id: "542a3a5aed25bb350faef507"
            })
            .exec(function(errr, data) {
                req.session.userId = data._id;
                next();
            });
    },
    authenticate: function(req, res, next) {
        var workflow = lib.workflow(req, res);
        // console.log('checking: ', req.body, req.files);
        // if (!req.session)
        if (req.path !== '/api/login' &&
            req.path !== '/api/reset_password' &&
            req.path !== '/api/app_details' &&
            req.path !== '/assets/images' &&
            req.path.split('/profile_pictures/')[0]) {
            if ( /*!req.session.userId*/ !req.body.senderId &&
                !req.query.senderId) {
                workflow.outcome.errfor.message = lib.message.NOT_LOGGED_IN;
                workflow.emit('response');
            } else {
                next();
            }
        } else {
            next();
        }
    },
    populateUserDetails: function(req, res, next) {
        var senderId = req.body.senderId ? req.body.senderId : req.query.senderId;
        if (senderId) {
            userModel
                .findOne({
                    // _id: req.session.userId                
                    _id: senderId
                })
                .populate('companyProfile.role')
                .exec(function(err, data) {
                    req.sender = data;
                    next();
                });
        } else {
            next();
        }
    }
};
