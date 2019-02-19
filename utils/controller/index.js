const co = require('co')
const handleRes = require('./handle_res.js')
function fail(errorCode,message){
    const error = new Error(message)
    error.name = errorCode
    throw error 
}
module.exports = {
    controller: _generator => function(req, res){
        const client = handleRes.getResFn(res)
        co(function*(){
            let rs
            try{
                rs = yield _generator({req,res,fail})
            }catch(err){
                client.fail(err)
                return
            }
            client.success(rs||null)
        })
    },
    delay: timeout => new Promise(resolve => setTimeout(resolve,timeout)),    
}
