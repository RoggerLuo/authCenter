const dao = require('./dao');
const {controller} = require('../../utils/controller')
const {updateFollowedCount} = require('../subject/dao')
const userId = 'c80250ac61534b178ffb9d001f537da7'

function* isFollowed({subjectId,userId}){
    const count = yield dao.count({subjectId,userId})
    return count > 0
}
module.exports = {
    follow: controller(['_id'],function*({req}){
        const subjectId = req.params._id
        const followed = yield isFollowed({subjectId,userId})
        if(!followed) {
            yield dao.create({subjectId,userId}) //增加点赞
            const followedCount = yield dao.count({subjectId})
            yield updateFollowedCount(subjectId,followedCount) //更新冗余字段    
        }
        return 'ok'
    }),
    deleteOne: controller([ '_id' ],function*({req}){
		const res = yield dao.deleteOne({subjectId:req.params._id})
        return res
    }),
    isFollowed
}
