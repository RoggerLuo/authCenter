const express = require('express')
const router = express.Router()
const app = require('./controller')
router.post('/:_id',app.mark)
router.delete('/:_id',app.unmark)
module.exports = router