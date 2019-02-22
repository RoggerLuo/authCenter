const express = require('express')
const router = express.Router()
const app = require('./controller')

router.post('/:_id',app.follow)
router.delete('/:_id',app.deleteOne)

module.exports = router