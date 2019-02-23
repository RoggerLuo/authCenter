const express = require('express')
const router = express.Router()
const app = require('./app')
router.get('/',app.getList)
module.exports = router