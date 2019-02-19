'use strict';

const log4js = require('log4js');
const config = require('../config');
const fs = require('fs');

module.exports = function () {
	if (!fs.existsSync('logs')) {
	  fs.mkdirSync('logs');
	}
	log4js.configure(config.log4js);
}