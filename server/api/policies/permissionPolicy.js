'use strict';
var lib = require('../../lib');
module.exports = {
    verifyPermissions: function(req, res, next) {
        var workflow = lib.workflow(req, res),
            path = req.params.path,
            operation = req.params.operation,
            permissions = req.sender.companyProfile.role[path],
            isAdmin = req.sender.companyProfile.role.trueName === 'admin',
            denyPermission = function() {
                workflow.outcome.errfor.message = lib.message.PERMISSION_DENIED;
                workflow.emit('response');
            };
        switch (path) {
            case 'candidate':
                switch (operation) {
                    case 'view':
                        if (permissions.own.personalProfile.view ||
                            permissions.own.companyProfile.view) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'view':
                    case 'search':
                        if (permissions.view) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'add':
                        if (permissions.add) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'edit':
                        if (permissions.edit) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    default:
                        next();
                }
                break;
            default:
                next();
        }
    }
};
