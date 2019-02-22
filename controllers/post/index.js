const express = require('express')
const router = express.Router()
const app = require('./app')
router.post('/',app.create)
router.get('/', app.getList)
router.get('/:_id', app.getOne)
router.delete('/:_id',app.deleteOne)



module.exports = router