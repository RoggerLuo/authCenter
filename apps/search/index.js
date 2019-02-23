const express = require('express')
const router = express.Router()
const app = require('../note/app')
router.get('/', app.search)

module.exports = router