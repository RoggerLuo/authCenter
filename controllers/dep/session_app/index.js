'use strict';
const co = require('co');
const validate = require('./validate');
const session = require('./session')
const HandleRes = require('../../utils/handle_res');

const createSession = function(req, res) {
	const client = HandleRes.getResFn(res)
	const { regenSession, cacheUser, justLogin } = session(req, res)
	if (req.session.userId &&
		(req.session.userId === req.body.user_id) &&
		(req.session.domainId === req.body.domain_id) &&
		(req.session.orgId === req.body.org_id)
	) { //如果已经登录过，则无需再验证ticket
		//之前传的是username，但是现在已经成了userId了
		console.log('延长登录时间');
		justLogin();
	} else {
		co(function*() {
			const employeeInfo = yield validate(req, res)
			/* 注意这里的转换 */
			employeeInfo.userId = employeeInfo.user_id 
			console.log(' ********* 验证完之后拿回的用户信息 ********* ', employeeInfo)
			yield regenSession()
			cacheUser(employeeInfo)
			client.success(employeeInfo)
		}).catch(client.fail);
	}
};

module.exports = {
	createSession,
}