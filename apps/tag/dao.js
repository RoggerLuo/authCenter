const {getDao,toObject} = require('../../utils/dao')
const dao = getDao(require('./model'))
const postDao = require('../post/dao')
const commentDao = require('../comment/dao')
const subjectFollowDao = require('../subjectFollow/dao')
const thumbDao = require('../thumb/dao')
    
module.exports = {
    ...dao,
}

