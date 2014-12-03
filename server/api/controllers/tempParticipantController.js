 /**
  * userController
  *
  */
 'use strict';
 var lib = require('../../lib'),
     tempParticipantModel = require('../models/tempParticipant'),
     utils = require('../utils');

 module.exports = {

     /*
      * get details of a perticular candidate
      */
     view: function(req, res) {
         var workflow = lib.workflow(req, res),
             candidates = "lalalalla",
             queryObject = req.query.registrationId ? {
                 registrationId: req.query.registrationId
             } : {};

         tempParticipantModel
             .find()
             .exec(function(err, candidates) {
                 console.log(err, candidates);
                 if (err) {
                     workflow.emit('exception', err);
                     return;
                 }
                 if (candidates && candidates.length !== 0) {
                     workflow.outcome.data = candidates;
                     workflow.emit('response');
                     return;
                 }
                 workflow.outcome.errfor.message = lib.message.NO_DATA;
                 workflow.emit('response');
             });
     },

     /**
      * search candidates
      */
     search: function(req, res) {
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
