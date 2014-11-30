/**
 * common policies
 *
 */
'use strict';
var lib = require('../../lib'),
    roleModel = require('../models/role');
module.exports = {
    authenticate: function(req, res, next) {
        // if (!req.session)
        if (req.path !== '/login') {
            if (!req.session.userId) {
                res.send('not logged in');
            } else {
                next();
            }
        } else {
            next();
        }
    },
    populateRole: function(req, res, next) {
        req.sender = {
            userId: req.session.userId
        };
        roleModel.find({
                _id: req.sender.userId
            })
            .exec(function(err, data) {
                req.sender.role = data.roleId;
                next();
            });
    }
};
