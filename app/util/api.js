'use strict';

var baseUrl = '/api';
module.exports = {
    login: baseUrl + '/login',
    logout: baseUrl + '/logout',

    //temp participant
    searchTempParticipant: baseUrl + '/temp_participant/search',
    findTempParticipant: baseUrl + '/temp_participant/find',

    //participant
    add: baseUrl + '/participant/add',
    clubs: baseUrl + '/participant/clubs',

    //shedules
    sheduleSatus: baseUrl + '/shedule/status',
    sheduleEvent: baseUrl + '/shedule/sheduleEvent'
};
