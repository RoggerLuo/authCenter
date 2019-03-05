const express = require('express')
const router = express.Router()
const app = require('../note/app')
router.get('/', app.search)
router.get('/keywords',app.searchKeyword)
module.exports = router