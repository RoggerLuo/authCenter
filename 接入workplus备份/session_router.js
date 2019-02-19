'use strict';

const express = require('express');
const router = express.Router();
const sessionApp = require('../apps/session_app');

router.post('/:userId', sessionApp.createSession);

module.exports = router;