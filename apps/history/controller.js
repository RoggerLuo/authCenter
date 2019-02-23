const dao = require('./dao')
const {controller} = require('../../utils/controller')
module.exports = {
	get: controller([],function*({req}){
        const username = req.headers.username
        return yield dao.find({username},{limit:10})
    }),
	// create: controller(['name'],function*({req}){
    //     const username = req.headers.username
    //     return yield dao.create({...req.body,username,createTime:Date.now()})
    // }),
    // del: controller(['_id'],function*({req}){
	// 	yield dao.deleteOne({_id:req.params._id})
    //     return 'ok'
    // }),
}
