 /**
  * userController
  *
  */
 'use strict';
 var lib = require('../../lib'),
     sheduleModel = require('../models/shedule'),
     sheduleUtil = require('../utils/sheduleUtil');

 module.exports = {

     /*
      * get shedule of a perticular event
      */
     getShedule: function(req, res) {
         var workflow = lib.workflow(req, res);
         eventId = req.query.event_id
         sheduleUtil
             .getShedule(eventId)
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
     addShedule: function(req, res) {
         var workflow = lib.workflow(req, res),
             eventId = req.body.eventId;

         if (registrationId === undefined) {
             workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
             workflow.emit('response');
             return;
         }
         registrationId = Number(registrationId);
         sheduleUtil
             .findShedule({
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
     }

 };
