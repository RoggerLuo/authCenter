const co = require('co')
const getEmployeeInfo = require('./getEmployeeInfo')
function isLoggedIn(req) { // 如果是相同域和组织
	if (
        req.session.user_id &&
		req.session.user_id === req.body.user_id &&
		req.session.domain_id === req.body.domain_id &&
		req.session.org_id === req.body.org_id
	) {
        return true
    }
    return false
}
function generateSession(req,employeeInfo){
    return new Promise((resolve)=>{
        req.session.regenerate(function(e) {
            if (e) {
                console.error('重新生成session失败')
                console.error(e)
                throw Error('e_session')
            } else {
                req.session.user_id = employeeInfo.user_id || ""
                req.session.domain_id = employeeInfo.domain_id || ""
                req.session.org_id = employeeInfo.org_id || ""
                req.session.avatar = employeeInfo.avatar || ""
                req.session.nickname = employeeInfo.nickname || ""
                req.session.mobile = employeeInfo.mobile || ""
                console.log(' ********* session生成成功 ********* ')
                resolve()
            }
        })
    })
}
const fetchInfo = function(req, client) {
    co(function*() {
        const employeeInfo = yield getEmployeeInfo(req, client)
        console.log(' ********* 验证完之后拿回的用户信息 ********* ', employeeInfo)
        yield generateSession(req,employeeInfo)
        client.success(req.session)
    }).catch(client.fail)
}
module.exports = {
    fetchInfo,
    isLoggedIn
}