const {getDao,toObject} = require('../../utils/dao')
const dao = getDao(require('./model'))
const {getAuthor} = require('../auth/dao')
module.exports = {
    ...dao,
    * updateThumb(commentId,thumbNumber){
        yield dao.findOneAndUpdate({_id:commentId}, {thumbCount:thumbNumber})
    },
    * updateReplyNumber(commentId){
        const count = yield dao.count({commentId})
        yield dao.findOneAndUpdate({_id:commentId}, {replyNumber:count})
    },
    * getSeveralRepliesFromHead(commentId){
        const sort = {createTime: 1}
        const replies = yield dao.operations.find({commentId},null,{limit: 2}).sort(sort).exec().then(toObject)
        const authors = yield replies.map(el=>getAuthor(el.authorId))
        replies.forEach((el,ind)=>{
            el.authorInfo = authors[ind]
        })
        return replies
    }
}
