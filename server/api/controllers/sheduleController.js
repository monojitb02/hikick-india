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

     /*
      * get details of a perticular candidate during registration
      */

     getShedule: function(req, res) {
         var workflow = lib.workflow(req, res),
             registrationId = req.query.registrationId;

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
     },

     /**
      * search candidates
      */
     search: function(req, res) {
         var workflow = lib.workflow(req, res),
             name = req.query.name,
             reg,
             searchObject;
         if (!name) {
             workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
             workflow.emit('response');
             return;
         }
         if (isNaN(name)) {
             reg = new RegExp(name.split(' ').join('|'));
             searchObject = {
                 name: {
                     $regex: reg,
                     $options: 'i'
                 }
             };
         } else {
             searchObject = Number(name);
         }
         sheduleUtil
             .getSheduleList(searchObject)
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
