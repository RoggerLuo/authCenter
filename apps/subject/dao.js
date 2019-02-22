const {getDao,toObject} = require('../../utils/dao')
const dao = getDao(require('./model'))
const postDao = require('../post/dao')
const commentDao = require('../comment/dao')
const subjectFollowDao = require('../subjectFollow/dao')
const thumbDao = require('../thumb/dao')
    
module.exports = {
    ...dao,
    updatePopularity: function*(subjectId){
        const within1month = {createTime:{'$gte': Date.now() - 30*24*60*60}}
        const condition = {subjectId,...within1month}
        const postCount = yield postDao.count(condition)
        const commentCount = yield commentDao.count(condition)
        const followedCount = yield subjectFollowDao.count(condition)
        const thumbCount = yield thumbDao.count(condition)
        const count = followedCount*4 + postCount*2 + commentCount + thumbCount
        yield dao.updateOne({_id:subjectId},{popularity:count})
        return 'ok'
    },
    updateFollowedCount:(subjectId,count) => dao.findOneAndUpdate({_id:subjectId},{followedCount:count}),
    getSubject: subjectId => dao.findOne({_id:subjectId}),
	getList: params => dao.find(params),
    updatePostCount: (subjectId,length) => dao.operations.findOneAndUpdate({_id:subjectId},{postCount:length})
}

