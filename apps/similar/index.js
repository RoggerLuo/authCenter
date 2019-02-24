const express = require('express')
const router = express.Router()
const app = require('../note/app')
router.get('/:id', app.similar)
module.exports = router