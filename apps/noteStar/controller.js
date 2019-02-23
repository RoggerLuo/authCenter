const {controller} = require('../../utils/controller')
const dao = require('../note/dao')
module.exports = {
    mark: controller(['_id'],function*({req,fail}){
        yield dao.updateOne({_id:req.params._id},{starred:true})
        return 'ok'
     }),
    unmark: controller(['_id'],function*({req,fail}){
        yield dao.updateOne({_id:req.params._id},{starred:false})
        return 'ok'         
    }),
}
