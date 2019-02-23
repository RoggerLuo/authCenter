const express = require('express')
const router = express.Router()
const app = require('./controller')
router.get('/',app.get)
router.post('/',app.create)
router.post('/:_id',app.update)
router.delete('/:_id',app.del)
module.exports = router