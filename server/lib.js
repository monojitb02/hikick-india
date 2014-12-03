'use strict';

module.exports = {
    express: require('express'), //Acquiring express and exporting it as express
    mongoose: require('mongoose'), //Acquiring mongoose and exporting it as mongoose
    _: require('underscore'), //Acquiring underscore and exporting it as _
    md5: require('MD5'), //Acquiring MD5 and exporting it as md5
    q: require('q'), //Acquiring q and exporting it as q
    expressSession: require('express-session'), //Acquiring express-session and exporting it as expressSession
    bodyParser: require('body-parser'), //Acquiring body-parser and exporting it as bodyParser
    cookieParser: require('cookie-parser'), //Acquiring cookie-parser and exporting it as cookieParser
    flat: require('flat'), //Acquiring flat and exporting it as flat
    puid: require('puid'), //Acquiring puid and exporting it as puid
    workflow: require('./api/responses/workflow'), //Acquiring workflow and exporting it as workflow
    config: require('./config'), //Acquiring config and exporting it as config
    message: require('./api/lang') //Acquiring lang and exporting it as message,
};
