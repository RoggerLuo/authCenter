const express = require('express')
const router = express.Router()
const app = require('./app')
router.post('/:commentId',app.create)
router.delete('/:commentId',app.deleteOne)
module.exports = router