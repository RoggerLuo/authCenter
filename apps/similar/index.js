const express = require('express')
const router = express.Router()
const app = require('../note/app')
router.get('/:_id', app.similar)
module.exports = router