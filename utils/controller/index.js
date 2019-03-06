const co = require('co')
const handleRes = require('./handle_res.js')
module.exports = {
    controller: (paramsList=[],_generator) => function(req, res){
        const client = handleRes.getResFn(res)
        co(function*(){
            let rs
            try{
                integretyCheck(paramsList,{...req.query,...req.body,...req.params})
                rs = yield _generator({req,res,fail})
            }catch(err){
                client.fail(err)
                return
            }
            if(rs===undefined) {
                client.success(null)
            }else{
                client.success(rs)
            }
        })
    },
    delay: timeout => new Promise(resolve => setTimeout(resolve,timeout)),
}
function toSimpleObject(mongooseObj) {
	if (!mongooseObj) {
		return mongooseObj
	}
	if (mongooseObj instanceof Array) {
		return mongooseObj.map(obj => obj.toObject());
	} else {
        if(mongooseObj.toObject) {
            return mongooseObj.toObject()
        } else {
            return null
        }
	}
}
function integretyCheck(requires, params) {
	requires = requires || []
    params = params || {}
    requires.forEach(name=>{
        if(params[name] === undefined) {
            console.log('==========================')
            console.log('missing parameter:'+name)
            console.log('==========================')
			fail(1000,'missing parameter:'+name)
        }
    })
}
function fail(errorCode,message){
    const error = new Error(message)
    error.name = errorCode
    throw error 
}
