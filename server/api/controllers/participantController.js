 /**
  * userController
  *
  */
 'use strict';
 var lib = require('../../lib'),
     utils = require('../utils'),
     participantUtil = require('../utils/participantUtil');

 module.exports = {
     /**
      *  add a new candidate
      */
     add: function(req, res) {
         var workflow = lib.workflow(req, res),
             participantData = req.body;

         if (participantData.dob && new Date(participantData.dob) === 'Invalid Date') {
             workflow.outcome.errfor.message = lib.message.INVALID_DATE;
             workflow.emit('response');
             return;
         }
         if (participantData.weight && isNaN(participantData.weight)) {
             workflow.outcome.errfor.message = lib.message.INVALID_WEIGHT;
             workflow.emit('response');
             return;
         }
         if (participantData.gender &&
             participantData.gender !== 'M' &&
             participantData.gender !== 'F') {
             workflow.outcome.errfor.message = lib.message.INVALID_GENDER;
             workflow.emit('response');
             return;
         }
         if (participantData._id) {
             // console.log(participantData);
             delete participantData._id;
             // console.log(participantData);
         }
         participantData.dob = new Date(participantData.dob);
         participantData.weight = Number(participantData.weight);
         participantUtil
             .addParticipant(participantData)
             .then(function(data) {
                 workflow.outcome.data = data;
                 workflow.emit('response');
             }, function(err) {
                 utils.errorNotifier(err, workflow);
             });
     },
     /**
      * update candidates profile
      */
     //FIX_ME:choiceOfEvent part not updating
     update: function(req, res) {
         var workflow = lib.workflow(req, res),
             participantData = req.body;
         if (participantData._id === undefined) {
             workflow.outcome.errfor.message = lib.message.ID_REQUIRED;
             workflow.emit('response');
             return;
         }
         participantUtil
             .updateParticipant(participantData)
             .then(function(data) {
                 if (!data) {
                     workflow.outcome.errfor.message = lib.message.UPDATE_NON_EXISTING_DOCUMENT_FAILED;
                     workflow.emit('response');
                 } else {
                     workflow.outcome.data = data;
                     workflow.emit('response');
                 }
             }, function(err) {
                 utils.errorNotifier(err, workflow);
             })
             .done();
     },
     getCubs: function(req, res) {
         var workflow = lib.workflow(req, res);
         participantUtil
             .getCubNames()
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
      * get details of all candidates
      */
     getAllParticipant: function(req, res) {
         var workflow = lib.workflow(req, res);
         participantUtil
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
             participantId = req.query.participantId;

         if (participantId === undefined) {
             workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
             workflow.emit('response');
             return;
         }
         participantUtil
             .findParticipant({
                 participantId: participantId
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
         participantUtil
             .getParticipantList({
                 name: {
                     $regex: reg,
                     $options: 'i'
                 }
             })
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
