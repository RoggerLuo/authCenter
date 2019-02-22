const {controller} = require('../../utils/controller')
const userId = 'c80250ac61534b178ffb9d001f537da7'
const dao = require('../post/dao')
function* isRecommend(_id){
    const post = yield dao.getOne({_id})
    return post.recommendStatus
}
module.exports = {
    recommendCreate: controller(['_id'],function*({req}){
        const _id = req.params._id
        yield dao.updateOne({_id},{recommendStatus:true})
        return 'ok'
    }),
    recommendDelete: controller(['_id'],function*({req}){
        const _id = req.params._id
        yield dao.updateOne({_id},{recommendStatus:false})
        return 'ok'
    }),
    getRecommend: controller(['subjectId'],function*({req}){
        return yield dao.find({subjectId:req.query.subjectId,recommendStatus:true})
    }),
    isRecommend
}
