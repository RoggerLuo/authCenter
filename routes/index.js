const express = require('express')
const v1 = express()
v1.use('/auth', require('../controllers/auth'))
// v1.use('/subject', require('./subject'))
// v1.use('/post', require('../apps/post'))
// v1.use('/medias', require('../apps/medias'))
module.exports = function (app) {
    app.use('/v1',v1)
}
