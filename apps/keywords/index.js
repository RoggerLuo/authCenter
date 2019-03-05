const express = require('express')
const router = express.Router()
const app = require('../note/app')
router.get('/', app.keywords)
module.exports = router