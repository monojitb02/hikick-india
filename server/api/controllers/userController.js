/**
 * userController
 *
 */
'use strict';
var lib = require('../../lib'),
    q = lib.q,
    md5 = lib.md5,
    userModel = require('../models/user'),
    roleModel = require('../models/role'),
    leaveModel = require('../models/leave'),
    utils = require('../utils'),
    userUtils = require('../utils/userUtil'),
    emailUtils = require('../utils/emailUtil'),
    leaveUtils = require('../utils/leaveUtil'),
    puid = new lib.puid(),
    mmMagic = lib.mmMagic,
    magic = new mmMagic.Magic(mmMagic.MAGIC_MIME_TYPE /* | mmm.MAGIC_MIME_ENCODING*/ );

module.exports = {
    /**
     * UserController.login()`
     */
    login: function(req, res) {
        var email,
            password,
            clientip = req.connection.remoteAddress,
            workflow = lib.workflow(req, res);
        /*if (req.session.userId) {
            workflow.outcome.errfor.message = lib.message.ALREADY_LOGGED_IN;
            workflow.emit('response');
        } else */
        if (req.body.email !== undefined &&
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
                    'companyProfile.email': email,
                    'personalProfile.password': password
                }, '-personalProfile.password')
                .populate('companyProfile.role' +
                    ' companyProfile.designation' +
                    ' companyProfile.company')
                .exec(function(err, data) {
                    if (err) {
                        workflow.emit('exception', err);
                    } else if (data) {
                        if (!data.companyProfile.isActive) {
                            workflow.outcome.errfor.message = lib.message.USER_BLOCKED;
                            workflow.emit('response');

                        } else {
                            req.session.userId = data._id;
                            delete data.personalProfile.password;
                            userModel
                                .findOneAndUpdate({
                                    _id: data._id
                                }, {
                                    $set: {
                                        'lastLogin.ip': clientip,
                                        'lastLogin.date': new Date()
                                    }
                                })
                                .exec(function(err) {
                                    if (err) {
                                        workflow.emit('exception', err);
                                    } else {
                                        workflow.outcome.data = data;
                                        workflow.emit('response');
                                    }
                                });
                        }
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
        var workflow = lib.workflow(req, res);
        req.session.destroy(function() {
            workflow.outcome.errfor.message = lib.message.LOGOUT_FAILED;
        });
        workflow.emit('response');
    },
    /**
     *  add a new User
     */
    add: function(req, res) {
        var workflow = lib.workflow(req, res),
            userData = {};
        lib._.each(req.body, function(value, key) {
            if ((typeof value === 'string') &&
                ((value.indexOf('{') !== -1) || (value.indexOf('[') !== -1))) {
                userData[key] = JSON.parse(value);
            } else {
                userData[key] = value;
            }
        });
        req.body = userData;

        if (userData.companyProfile === undefined) {
            workflow.outcome.errfor.message = lib.message.USER_SHOULD_HAVE_A_COMPANYPROFILE;
            workflow.emit('response');
            return;
        }
        if (userData.companyProfile.role === undefined) {
            workflow.outcome.errfor.message = lib.message.USER_SHOULD_HAVE_A_ROLE;
            workflow.emit('response');
            return;
        }
        roleModel
            .findOne({
                _id: userData.companyProfile.role
            })
            .exec(function(err, role) {
                if (err) {
                    workflow.emit('exception', err);
                    return;
                }
                if (!role) {
                    workflow.outcome.errfor.message = lib.message.INVALID_ROLE;
                    workflow.emit('response');
                    return;
                }
                if (role.trueName === 'admin') {
                    if (req.sender.companyProfile.role.trueName !== 'admin') {
                        workflow.outcome.errfor.message = lib.message.ADD_ADMIN_NOT_PERMITED;
                        workflow.emit('response');
                        return;
                    }
                    delete userData.companyProfile.manager;
                } else if (!userData.companyProfile.manager) {
                    workflow.outcome.errfor.message = lib.message.USER_SHOULD_HAVE_A_MANAGER;
                    workflow.emit('response');
                    return;
                }
                if (req.files && req.files.profilePicture) {
                    if (req.files.profilePicture.size / (1024 * 1024) > 2) {
                        workflow.outcome.errfor.message = lib.message.IMAGE_SIZE_LIMIT_EXCEEDED;
                        workflow.emit('response');
                        return;
                    } else {
                        magic.detectFile(req.files.profilePicture.path, function(err, result) {
                            if (err) {
                                workflow.emit('exception', err);
                            }
                            console.log(result);
                            userData.filePath = req.files.profilePicture.path;
                        });
                    }
                }
                if (userData.leaveConfig &&
                    lib._.keys(userData.leaveConfig).length) {
                    if (userData.leaveConfig.startDate === undefined ||
                        userData.leaveConfig.endDate === undefined ||
                        userData.leaveConfig.maxEL === undefined ||
                        userData.leaveConfig.maxCL === undefined) {
                        workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
                        workflow.emit('response');
                        return;
                    } else if (new Date(userData.leaveConfig.endDate) <= new Date()) {
                        workflow.outcome.errfor.message = lib.message.END_DATE_CANNT_BE_PAST_DATE;
                        workflow.emit('response');
                        return;
                    } else if ((new Date(userData.leaveConfig.endDate) - new Date(userData.leaveConfig.startDate)) <
                        (24 * 3600 * 1000 * 30)) {
                        workflow.outcome.errfor.message = lib.message.DURATION_MUST_BE_ALTEAST_30_DAYS;
                        workflow.emit('response');
                        return;
                    }
                    userData.leaveConfig.endDate = new Date(userData.leaveConfig.endDate).setHours(0, 0, 0, 0);
                    userData.leaveConfig.startDate = new Date(userData.leaveConfig.startDate).setHours(0, 0, 0, 0);
                }
                userUtils.hasManagingPower(userData.companyProfile.manager)
                    .then(function() {
                        userData.companyProfile.company = req.sender.companyProfile.company;
                        return userUtils.updateUser(userData);
                    }, function() {
                        var deferred = lib.q.defer();
                        workflow.outcome.errfor.message = lib.message.IS_NOT_MANAGER;
                        deferred.reject();
                        return deferred.promise;
                    })
                    .then(function(user) {
                        workflow.outcome.data = user;
                        workflow.emit('response');
                    }, function(err) {
                        utils.errorNotifier(err, workflow);
                    })
                    .done();
            });
    },
    /*
     * get own profile and leave details
     */
    view: function(req, res) {
        var workflow = lib.workflow(req, res);
        lib.q.all([userUtils.findOne(req.sender._id), leaveUtils.getLeaveAccount(req.sender._id)])
            .spread(function(user, leaveDetails) {
                workflow.outcome.data = user;
                workflow.outcome.data.leaveDetails = leaveDetails;
                workflow.emit('response');
            }, function(err1, err2) {
                if (err1) {
                    workflow.emit('exception', err1);
                } else {
                    workflow.emit('exception', err2);
                }
            });

    },
    /*
     * get any employee's profile and leave details
     */
    viewOne: function(req, res) {
        var workflow = lib.workflow(req, res);
        if (req.query.userId === undefined) {
            workflow.outcome.errfor.message = lib.message.USERID_REQUIRED;
            workflow.emit('response');
            return;
        }
        lib.q.all([userUtils.findOne(req.query.userId), leaveUtils.getLastLeaveAccount(req.query.userId)])
            .spread(function(user, leaveDetails) {
                workflow.outcome.data = user;
                workflow.outcome.data.leaveDetails = leaveDetails;
                workflow.emit('response');
            }, function(err1, err2) {
                if (err1) {
                    workflow.emit('exception', err1);
                } else {
                    workflow.emit('exception', err2);
                }
            });
    },
    /*
     * get all employee's profile details
     */
    viewAll: function(req, res) {
        var workflow = lib.workflow(req, res),
            getAllUsers = function(sender) {
                if (sender.companyProfile.role.trueName === 'admin') {
                    return userUtils.getAll(sender.companyProfile.company);
                } else {
                    return userUtils.getSubordinates([sender._id]);
                }
            };
        getAllUsers(req.sender)
            .then(function(ids) {
                var deferred = q.defer();
                userModel
                    .find({
                        $and: [{
                            _id: {
                                $in: ids
                            }
                        }, {
                            _id: {
                                $ne: req.sender._id
                            }
                        }]
                    }, '-personalProfile.password')
                    .populate('companyProfile.designation' +
                        ' companyProfile.role' +
                        ' companyProfile.manager', '-company')
                    .sort('companyProfile.name.first')
                    .exec(function(err, users) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(users);
                        }
                    });
                return deferred.promise;
            })
            .done(function(user) {
                workflow.outcome.data = user;
                workflow.emit('response');
                return;
            });
    },
    /**
     * update own profile
     */
    updateOwn: function(req, res) {
        var workflow = lib.workflow(req, res),
            permissions = req.sender.companyProfile.role.user.own,
            userData = {};
        lib._.each(req.body, function(value, key) {
            if ((typeof value === 'string') &&
                ((value.indexOf('{') !== -1) || (value.indexOf('[') !== -1))) {
                userData[key] = JSON.parse(value);
            } else {
                userData[key] = value;
            }
        });
        req.body = userData;
        if (req.body.companyProfile) {
            if (!permissions.companyProfile) {
                workflow.outcome.errfor.message = lib.message.PERNISSION_UPDATION_COMPANY_PROFILE;
                workflow.emit('response');
                return;
            }
        }
        if (req.body.personalProfile) {
            if (!permissions.personalProfile) {
                workflow.outcome.errfor.message = lib.message.PERNISSION_UPDATION_PERSONAL_PROFILE;
                workflow.emit('response');
                return;
            }
        }
        if (req.files && req.files.profilePicture) {
            if (req.files.profilePicture.size / (1024 * 1024) > 2) {
                workflow.outcome.errfor.message = lib.message.IMAGE_SIZE_LIMIT_EXCEEDED;
                workflow.emit('response');
                return;
            } else {
                magic.detectFile(req.files.profilePicture.path, function(err, result) {
                    if (err) {
                        workflow.emit('exception', err);
                    }
                    console.log(result);
                    userData.filePath = req.files.profilePicture.path;
                });
            }
        }
        if (userData.leaveConfig &&
            req.sender.companyProfile.role.trueName !== 'admin') {
            workflow.outcome.errfor.message = lib.message.CANNT_SET_OWN_LEAVE_CONFIG;
            workflow.emit('response');
            return;
        }
        if (req.files && req.files.profilePicture) {
            if (req.files.profilePicture.size / (1024 * 1024) > 2) {
                workflow.outcome.errfor.message = lib.message.IMAGE_SIZE_LIMIT_EXCEEDED;
                workflow.emit('response');
                return;
            } else {
                magic.detectFile(req.files.profilePicture.path, function(err, result) {
                    if (err) {
                        workflow.emit('exception', err);
                    }
                    console.log(result);
                    userData.filePath = req.files.profilePicture.path;
                });
            }
        }
        req.body._id = req.sender._id;
        userUtils.updateUser(userData)
            .then(function(data) {
                workflow.outcome.data = data;
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            })
            .done();
    },
    /**
     * update others profile as an Admin
     */
    updateOthers: function(req, res) {
        var workflow = lib.workflow(req, res),
            permissions = req.sender.companyProfile.role.user.others,
            userData = {};
        lib._.each(req.body, function(value, key) {
            if ((typeof value === 'string') &&
                ((value.indexOf('{') !== -1) || (value.indexOf('[') !== -1))) {
                userData[key] = JSON.parse(value);
            } else {
                userData[key] = value;
            }
        });
        req.body = userData;
        if (req.body.companyProfile) {
            if (!permissions.companyProfile.edit) {
                workflow.outcome.errfor.message = lib.message.PERMISSION_UPDATION_COMPANY_PROFILE;
                workflow.emit('response');
                return;
            }
        }
        if (req.body.personalProfile) {
            if (!permissions.personalProfile.edit) {
                workflow.outcome.errfor.message = lib.message.PERMISSION_UPDATION_PERSONAL_PROFILE;
                workflow.emit('response');
                return;
            }
        }
        if (req.body._id === undefined) {
            workflow.outcome.errfor.message = lib.message.ID_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (req.files && req.files.profilePicture) {
            if (req.files.profilePicture.size / (1024 * 1024) > 2) {
                workflow.outcome.errfor.message = lib.message.IMAGE_SIZE_LIMIT_EXCEEDED;
                workflow.emit('response');
                return;
            } else {
                magic.detectFile(req.files.profilePicture.path, function(err, result) {
                    if (err) {
                        workflow.emit('exception', err);
                    }
                    console.log(result);
                    userData.filePath = req.files.profilePicture.path;
                });
            }
        }
        if (userData.leaveConfig &&
            lib._.keys(userData.leaveConfig).length) {
            if (userData.leaveConfig.startDate === undefined ||
                userData.leaveConfig.endDate === undefined ||
                userData.leaveConfig.maxEL === undefined ||
                userData.leaveConfig.maxCL === undefined) {
                workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
                workflow.emit('response');
                return;
            } else if (new Date(userData.leaveConfig.endDate) <= new Date()) {
                workflow.outcome.errfor.message = lib.message.END_DATE_CANNT_BE_CURRENT_DATE;
                workflow.emit('response');
                return;
            } else if ((new Date(userData.leaveConfig.endDate) - new Date(userData.leaveConfig.startDate)) <
                (24 * 3600 * 1000 * 30)) {
                workflow.outcome.errfor.message = lib.message.DURATION_MUST_BE_ALTEAST_30_DAYS;
                workflow.emit('response');
                return;
            }
        }
        userUtils.updateUser(userData)
            .then(function(data) {
                workflow.outcome.data = data;
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            })
            .done();
    },
    /**
     * block other user as an Admin
     */
    block: function(req, res) {
        var workflow = lib.workflow(req, res);
        if (req.body._id === undefined ||
            req.body.blocked === undefined) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (typeof(req.body.blocked) !== 'boolean') {
            workflow.outcome.errfor.message = lib.message.INVALID_TYPE_IN_BLOCKED;
            workflow.emit('response');
            return;
        }
        userModel
            .findOneAndUpdate({
                _id: req.body._id
            }, {
                'companyProfile.isActive': !req.body.blocked
            })
            .exec(function(err, user) {
                if (err) {
                    workflow.emit('exception', err);
                    return;
                } else if (user) {
                    workflow.emit('response');
                } else {
                    workflow.outcome.errfor.message = lib.message.NO_DATA;
                    workflow.emit('response');
                }
            });
    },
    /**
     * change own password
     */
    changePassword: function(req, res) {
        var workflow = lib.workflow(req, res),
            existingPassword = req.body.oldPassword,
            newPassword = req.body.newPassword;
        if (req.body.secure === 'false' ||
            req.body.secure === false) {
            existingPassword = md5(existingPassword);
            newPassword = md5(newPassword);
        }
        userModel
            .findOne({
                _id: req.sender._id,
                'personalProfile.password': existingPassword
            })
            .exec(function(err, user) {
                if (user) {
                    userUtils.updatePassword(req.sender._id, newPassword)
                        .then(function() {
                            workflow.outcome.message = lib.message.PASSWORD_CHANGED_SUCCESSFULLY;
                            workflow.emit('response');
                        }, function(err) {
                            workflow.emit('exception', err);
                        })
                        .done();
                } else {
                    workflow.outcome.errfor.message = lib.message.INCORRECT_EXISTING_PASSWORD;
                    workflow.emit('response');
                }
            });
    },
    /**
     * reset password
     */
    resetPassword: function(req, res) {
        var workflow = lib.workflow(req, res),
            newPassword = puid.generate();
        userModel
            .findOne({
                'companyProfile.email': req.body.email
            })
            .exec(function(err, user) {
                if (user) {
                    userUtils.updatePassword(user._id, md5(newPassword))
                        .then(function() {
                            console.log(newPassword);
                            /*emailUtils.sendMail({
                             //to: 'monojitb02@gmail.com',
                             to: user.companyProfile.email,
                             subject: 'Password Changed',
                             html: 'Your new password is ' + newPassword
                             });*/
                            workflow.emit('response'); //send message to user to check mail
                        }, function(err) {
                            workflow.emit('exception', err);
                        })
                        .done();
                } else {
                    workflow.outcome.errfor.message = lib.message.INCORRECT_EMAIL;
                    workflow.emit('response');
                }
            });

    },
    resetOthersPassword: function(req, res) {
        var workflow = lib.workflow(req, res),
            newPassword = puid.generate();
        userUtils.updatePassword(req.body._id, md5(newPassword))
            .then(function() {
                console.log(newPassword);
                /*return emailUtils.sendMail({
                 //to: 'monojitb02@gmail.com',
                 to: user.companyProfile.email,
                 subject: 'Password Changed',
                 html: 'Your new password is ' + newPassword
                 });*/
                workflow.emit('response'); //send message to user to check mail
            }, function(err) {
                workflow.emit('exception', err);
            })
            .done();

    },
    searchEmployee: function(req, res) {
        var workflow = lib.workflow(req, res),
            name = req.query.name,
            reg,
            searchOptoions;
        if (!name) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (req.query.searchFor) {
            searchOptoions = req.query.searchFor;
        } else {
            searchOptoions = ['admin', 'employee', 'manager'];
        }
        reg = new RegExp(name.split(' ').join('|'));
        userUtils.searchUsers(reg, req.sender.companyProfile.company, searchOptoions)
            .then(function(data) {
                if (data.length === 0) {
                    workflow.outcome.errfor.message = lib.message.NO_DATA;
                    workflow.emit('response');
                } else {
                    workflow.outcome.data = data;
                    workflow.emit('response');
                }
            }, function(err) {
                workflow.emit('exception', err);
            })
            .done();
    }
};
