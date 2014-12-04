 /**
  * userController
  *
  */
 'use strict';
 var lib = require('../../lib'),
     tempParticipantModel = require('../models/tempParticipant'),
     tempParticipantUtil = require('../utils/tempParticipantUtil');

 module.exports = {

     /*
      * get details of all candidates
      */
     getAllParticipant: function(req, res) {
         var workflow = lib.workflow(req, res);
         tempParticipantUtil
             .getParticipantList()
             .then(function(data) {
                 if (!data.length) {
                     workflow.outcome.errfor.message = lib.message.NO_DATA;
                     workflow.emit('response');
                 } else {
                     workflow.outcome.data = data;
                     workflow.emit('response');
                 }
             }, function(err) {
                 workflow.emit('exception', err);
             });
     },

     /*
      * get details of a perticular candidate during registration
      */

     getParticipant: function(req, res) {
         var workflow = lib.workflow(req, res),
             registrationId = req.query.registrationId;

         if (registrationId === undefined) {
             workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
             workflow.emit('response');
             return;
         }
         registrationId = Number(registrationId);
         tempParticipantUtil
             .findParticipant({
                 registrationId: registrationId
             })
             .then(function(data) {
                 if (!data.length) {
                     workflow.outcome.errfor.message = lib.message.NO_DATA;
                     workflow.emit('response');
                 } else {
                     workflow.outcome.data = data[0];
                     workflow.emit('response');
                 }
             }, function(err) {
                 workflow.emit('exception', err);
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
         reg = new RegExp(name.split(' ').join('|'));
         tempParticipantUtil
             .getParticipantList({
                 name: {
                     $regex: reg,
                     $options: 'i'
                 }
             })
             .then(function(data) {
                 if (!data.length) {
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
