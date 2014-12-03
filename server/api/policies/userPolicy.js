/**
 * common policies
 *
 */
'use strict';
var lib = require('../../lib'),
    userModel = require('../models/user');

module.exports = {
    dummyLogin: function(req, res, next) {
        userModel.findOne({
                _id: "547cb1cdbd419a9357893bae"
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
        if (req.path !== '/api/login') {
            if (!req.session.userId) { /*!req.body.senderId && !req.query.senderId*/
                workflow.outcome.errfor.message = lib.message.NOT_LOGGED_IN;
                workflow.emit('response');
            } else {
                userModel
                    .findOne({
                        _id: req.session.userId
                            // _id: senderId
                    })
                    .exec(function(err, data) {
                        if (data) {
                            req.sender = data;
                            next();
                        } else {
                            workflow.outcome.errfor.message = lib.message.NOT_LOGGED_IN;
                            workflow.emit('response');
                        }
                    });
            }
        } else {
            next();
        }
    }
};
