 /**
  * userController
  *
  */
 'use strict';
 var lib = require('../../lib'),
     q = lib.q,
     md5 = lib.md5,
     userModel = require('../models/user'),
     utils = require('../utils'),
     puid = new lib.puid();

 module.exports = {

     /*
      * get details of a perticular candidate
      */
     view: function(req, res) {
         var workflow = lib.workflow(req, res),
             candidates = "lalalalla";
         workflow.outcome.data = candidates; //from database
         workflow.emit('response');
         // if (err) {
         //     workflow.emit('exception', err);
         // }

     },
     /**
      *  add a new candidate
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
     },
     /**
      * update candidates profile
      */
     update: function(req, res) {
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
         userUtils.updateCandidate(userData)
             .then(function(data) {
                 workflow.outcome.data = data;
                 workflow.emit('response');
             }, function(err) {
                 workflow.emit('exception', err);
             })
             .done();
     },
     searchCandidate: function(req, res) {
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
