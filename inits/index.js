'use strict';

module.exports = function (app) {

    global._ = require('lodash');
	
    require('./init_db');
    require('./init_logger')();
    require('./init_middleware')(app);
    
}