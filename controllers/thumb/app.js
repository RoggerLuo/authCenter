const dao = require('./dao')
const {controller} = require('../../utils/controller')
const {updateThumb} = require('../post/dao')
const userId = 'c80250ac61534b178ffb9d001f537da7'
function* isThumbed({postId,userId}){
    const data = yield dao.find({postId,userId})
    return data.length > 0
}

module.exports = {
    isThumbed,
    create: controller(['postId'],function*({req}){
        const postId = req.body.postId
        const thumbed = yield isThumbed({postId,userId})
        if(!thumbed) {
            yield dao.create({postId,userId}) //增加点赞
            const thumbNumber = yield dao.count({postId})
            yield updateThumb(postId,thumbNumber) //更新冗余字段    
        }
        return 'ok'
    }),
    deleteOne: controller(['_id'],function*({req}){
        yield dao.deleteOne(req.params)
        return ok
    }),
}
