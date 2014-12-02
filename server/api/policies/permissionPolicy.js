'use strict';
var lib = require('../../lib');
module.exports = {
    verifyPermissions: function(req, res, next) {
        var workflow = lib.workflow(req, res),
            operation = req.params.operation,
            permissions,
            denyPermission = function() {
                workflow.outcome.errfor.message = lib.message.PERMISSION_DENIED;
                workflow.emit('response');
            };
        if (operation === 'login') {
            next();
            return;
        }
        permissions = req.sender.role;
        switch (operation) {
            case 'candidate/add':
            case 'candidate/update':
                if (permissions.registerCandidate) {
                    next();
                } else {
                    denyPermission();
                }
                break;
            default:
                next();
        }
    }
};
