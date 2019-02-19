'use strict';

const express = require('express');
const router = express.Router();
const accountApp = require('../apps/account_app');
const sessionApp = require('../apps/session_app');
// router.post('/:userId', sessionApp.createSession);

router.post('/register', accountApp.register);
// router.post('/:mobile', accountApp.login);
router.post('/login', sessionApp.createSession);
router.get('/logout', accountApp.logout);
router.get('/info', accountApp.info);

module.exports = router;