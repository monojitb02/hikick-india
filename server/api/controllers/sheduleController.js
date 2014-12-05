 /**
  * userController
  *
  */
 'use strict';
 var lib = require('../../lib'),
     sheduleModel = require('../models/Shedule'),
     sheduleUtil = require('../utils/SheduleUtil');

 module.exports = {

     /*
      * get details of all candidates
      */
     getAllShedule: function(req, res) {
         var workflow = lib.workflow(req, res);
         sheduleUtil
             .getSheduleList()
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
     getAllShedulableEvents: function(req, res) {
         var workflow = lib.workflow(req, res);
         sheduleUtil
             .getSheduleableEvents()
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
