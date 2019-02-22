const dao = require('./dao')
const {getSubjectId} = require('../post/dao') 
const {getAuthor} = require('../auth/dao')
const {controller} = require('../../utils/controller')
const userId = 'c80250ac61534b178ffb9d001f537da7'
module.exports = {
    getComments: controller(['postId'],function*({req}){
        let data
        if(req.query.userId) { //只看楼主
            data = yield dao.find({...req.params,authorId:req.query.userId}).then(data=>data.filter(el=>el.commentId===undefined))
        }else{
            data = yield dao.find(req.params).then(data=>data.filter(el=>el.commentId===undefined))
        }
        const replies = yield data.map(el=>dao.getSeveralRepliesFromHead(el._id))
        const authors = yield data.map(el=>getAuthor(el.authorId))
        data.forEach((el,ind)=>{
            el.replies = replies[ind]
            el.authorInfo = authors[ind]
        })
        return data
    }),
    getReplies: controller(['postId','commentId'],function*({req}){
        return yield dao.find(req.params)
    }),
    createComment: controller(['postId','content'],function*({req, fail}){
        const params = {...req.params, ...req.body, authorId:userId, createTime: Date.now()}
        params.subjectId = yield getSubjectId(req.params.postId)
        if(!params.subjectId) fail(321,'post id not exist')
        const entry = yield dao.create(params)
        return {_id: entry._id}
    }),
    createReply: controller(['postId','content','commentId'],function*({req}){
        const params = {...req.params, ...req.body, authorId:userId, createTime: Date.now()}
        params.subjectId = yield getSubjectId(req.params.postId)
        params.replyUserId = req.body.userId
        const entry = yield dao.create(params)
        yield dao.updateReplyNumber(req.params.commentId)
        return {_id: entry._id}
    }),
    getOne: controller([ '_id' ],function*({req, res}){
        let post = yield dao.incrementReadNumber(req.params._id) // 阅读+1
        if(post) {
            post.thumbed = yield thumbApp.isThumbed({postId:req.params._id,userId})
            post.author = yield getAuthor(userId)
        }
        return post
    }),
    deleteOne: controller([ '_id' ],function*({req, res}){
		yield dao.deleteOne(req.params)
        return 'ok'
    }),
}
