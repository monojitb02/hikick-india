'use strict';

module.exports = {
    //db: 'mongodb://192.168.0.15/intranet',
    db: 'mongodb://localhost/hikick',
    // db: 'mongodb://intranet:innofied123@ds051970.mongolab.com:51970/intranet',
    server: {
        host: 'localhost',
        port: process.env.PORT || 8000
    }
};
