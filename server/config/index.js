'use strict';

module.exports = {
    // db: 'mongodb://localhost/hikick',
    db: 'mongodb://hikickdbuser1:anjanmonojit02@ds063160.mongolab.com:63160/hikick',
    server: {
        host: 'localhost',
        port: process.env.PORT || 8000
    },
    applicationEndsOn: new Date('12/19/2014') // in MM/DD/YYYY format
};
