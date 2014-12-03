 /**
  * userController
  *
  */
 'use strict';
 var lib = require('../../lib'),
     Q = lib.q,
     tempParticipantUtil = require('../utils/temp_participantUtil');

 module.exports = {

     /*
      * get details of a perticular candidate during registration
      */

     //TO_CHECK : possibe problel map with table
     getParticipant: function(req, res) {
         var workflow = lib.workflow(req, res),
             participantId = req.query.participantId;

         if (participantId === undefined) {
             workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
             workflow.emit('response');
             return;
         }
         participantId = Number(participantId);
         tempParticipantUtil.findParticipant(participantId)
             .then(function(data) {
                 if (data === null) {
                     workflow.outcome.errfor.message = lib.message.NO_DATA;
                     workflow.emit('response');
                 } else {
                     workflow.outcome.data = data;
                     workflow.emit('response');
                 }
             }, function(err) {
                 workflow.emit('exception', err);
             });
     }

 };
