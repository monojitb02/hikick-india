/**
 * event.js
 */

'use strict';
var lib = require('../../lib'),
    Schema = lib.mongoose.Schema,
    eventSchema = new Schema({
        eventId: {
            type: Number,
            required: true
        },
        eventName: {
            type: String,
            required: true
        },
        ageLimitUpper: { //(bellow upper limit.Eg.10 means Limit defines Bellow 10)
            type: Number,
            required: true
        },
        ageLimitLower: {
            type: Number,
            required: true
        },
        weightLimitUpper: { //(bellow upper limit.Eg.10 means Limit defines Bellow 10)
            type: Number,
            required: true
        },
        weightLimitLower: {
            type: Number,
            required: true
        }
    }, {
        versionKey: false
    });
eventSchema.index({
    eventId: 1
}, {
    unique: true
});
module.exports = lib.mongoose.model('event', eventSchema);
