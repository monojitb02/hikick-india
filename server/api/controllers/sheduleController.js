 /**
  * userController
  *
  */
 'use strict';
 var lib = require('../../lib'),
     sheduleModel = require('../models/shedule'),
     sheduleUtil = require('../utils/sheduleUtil');

 module.exports = {
     getEventList: function(req, res) {
         var workflow = lib.workflow(req, res);
         sheduleUtil
             .getEventList()
             .then(function(result) {
                 if (!result.length) {
                     workflow.outcome.errfor.message = lib.message.NO_DATA;
                     workflow.emit('response');
                 } else {
                     workflow.outcome.data = result;
                     workflow.emit('response');
                 }
             }, function(err) {
                 workflow.emit('exception', err);
             });
     },
     searchParticipantForBy: function(req, res) {
         var participants = [];
         sheduleUtil
             .searchParticipant(req.query.query, req.query.eventId)
             .then(function(result) {
                 if (!result.length) {
                     res.send(['No Data Found']);
                 } else {
                     result.forEach(function(participant) {
                         participants.push(participant.name + ' ID: ' + participant.participantId)
                     })
                     res.send(participants);
                 }
             }, function() {
                 res.send(['Searching faild']);
             });
     },
     /*
      * get shedule of all events
      */
     getAllShedule: function(req, res) {
         var workflow = lib.workflow(req, res);
         sheduleUtil
             .getShedule({})
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
      * get shedule of a perticular event
      */
     getEventShedule: function(req, res) {
         var workflow = lib.workflow(req, res),
             event_id = req.query.event_id;
         if (event_id === undefined) {
             workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
             workflow.emit('response');
             return;
         }
         sheduleUtil
             .getShedule({
                 event: event_id
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
     getSheduleStatus: function(req, res) {
         var workflow = lib.workflow(req, res);
         sheduleUtil
             .getSheduleStatus()
             .then(function(data) {
                 if (!data.length) {
                     workflow.outcome.errfor.message = lib.message.NO_DATA;
                     workflow.emit('response');
                 } else {
                     workflow.outcome.data = data.sort(function(first, second) {
                         return first.eventId > second.eventId ? 1 : -1
                     });
                     workflow.emit('response');
                 }
             }, function(err) {
                 workflow.emit('exception', err);
             });
     },
     /*
      * get details of a perticular candidate during registration
      */
     addShedule: function(req, res) {
         var workflow = lib.workflow(req, res);
         if (req.body.eventId === undefined) {
             workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
             workflow.emit('response');
             return;
         }
         sheduleUtil
             .sheduleEvent(req.body.eventId, req.body.candidateGiveBy)
             .then(function() {
                 sheduleUtil
                     .getSheduleStatus()
                     .then(function(data) {
                         if (!data.length) {
                             workflow.outcome.errfor.message = lib.message.NO_DATA;
                             workflow.emit('response');
                         } else {
                             workflow.outcome.data = data.sort(function(first, second) {
                                 return first.eventId > second.eventId ? 1 : -1
                             });
                             workflow.emit('response');
                         }
                     }, function(err) {
                         workflow.emit('exception', err);
                     });
             }, function(err) {
                 workflow.emit('exception', err);
             });
     },
     printPlayersChart: function(req, res) {
         var workflow = lib.workflow(req, res);
         if (req.query.eventId === undefined) {
             workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
             workflow.emit('response');
             return;
         }
         sheduleUtil
             .getPlayersChart(req.query.eventId)
             .then(function(csvData) {
                 console.log('csvData', csvData);
                 res.set({
                     'Content-Disposition': 'attachment; filename=participant_list_' + req.query.eventId + '.csv'
                 });
                 //res.contentType('text/csv');
                 res.send(csvData);
             }, function(err) {
                 workflow.emit('exception', err);
             });
     }
 };
