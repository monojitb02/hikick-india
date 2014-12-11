 /**
  * userController
  *
  */
 'use strict';
 var lib = require('../../lib'),
     utils = require('../utils'),
     matchUtil = require('../utils/matchUtil');

 module.exports = {
     /**
      *  add a new candidate
      */
     add: function(req, res) {
         var workflow = lib.workflow(req, res),
             matchData = req.body;
         /*   if (!matchData.date ||
                !matchData.event ||
                !matchData.level ||
                !matchData.dojoNumber ||
                !matchData.referee ||
                !matchData.timeBreaks ||
                !matchData.redCornerPlayer ||
                !matchData.redCornerPoints ||
                !matchData.redCornerWarnings1 ||
                !matchData.redCornerWarnings2 ||
                !matchData.blueCornerPlayer ||
                !matchData.blueCornerPoints ||
                !matchData.blueCornerWarnings1 ||
                !matchData.blueCornerWarnings2 ||
                !matchData.winner) {

            }*/

         matchUtil
             .addMatches(matchData)
             .then(function(data) {
                 workflow.outcome.data = data;
                 workflow.emit('response');
             }, function(err) {
                 utils.errorNotifier(err, workflow);
             })
             .done();
     },
     /*
      * get list of all match
      */
     getAllMatches: function(req, res) {
         var workflow = lib.workflow(req, res);
         matchUtil
             .getMatchList()
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
      * get details of a perticular match
      */
     getMatch: function(req, res) {
         var workflow = lib.workflow(req, res),
             matchId = req.query.matchId;

         if (matchId === undefined) {
             workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
             workflow.emit('response');
             return;
         }
         matchUtil
             .findMatch({
                 _id: matchId
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
     }


 };
