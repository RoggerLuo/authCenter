const {controller} = require('../../utils/controller')
const userId = 'c80250ac61534b178ffb9d001f537da7'
const dao = require('../post/dao')
function* isTop(_id){
    const post = yield dao.getOne({_id})
    return post.topStatus
}
module.exports = {
    topCreate: controller(['_id'],function*({req}){
        const _id = req.params._id
        yield dao.updateOne({_id},{topStatus:true})
        return 'ok'
    }),
    topDelete: controller(['_id'],function*({req}){
        const _id = req.params._id
        yield dao.updateOne({_id},{topStatus:false})
        return 'ok'
    }),
    getTop: controller(['subjectId'],function*({req}){
        return yield dao.find({subjectId:req.query.subjectId,topStatus:true})
    }),
    isTop
}
