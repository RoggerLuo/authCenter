'use strict';

const express = require('express');
const app = express();

require('./inits')(app);
require('./routes')(app);

const server = require('http').createServer(app);
const config = require('./config');
server.listen(config.port,() => console.log(`Express server listening on :${config.port}, in ${app.get('env')} mode`));

