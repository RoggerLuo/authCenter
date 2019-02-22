'use strict';

const co = require('co');
const HandleRes = require('../../utils/handle_res');
const Atwork_Tool = require('../../utils/atwork_tool');
// const AccountDao = require("../daos/account_dao");

function session(req, res) {
	const client = HandleRes.getResFn(res);	
	// 理论上每次用户登录都意味着开启了一个新的session，因此需要重新生成新的sid
	// const regenSession = function() {
	// 	return new Promise((success, fail) => {
	// 		req.session.regenerate(function(e) {
	// 			if (e) {
	// 				console.error('重新生成sid失败', e);
	// 				fail(new Error('e_session'));
	// 			} else {
	// 				success();
	// 			}
	// 		});
	// 	});
	// };

	// 把登录用户的信息存储到session里
	// const cacheUser = function(employeeInfo) {
	// 	req.session.userId = employeeInfo.user_id || employeeInfo.userId || ""
	// 	req.session.domainId = employeeInfo.domain_id
	// 	req.session.orgId = employeeInfo.org_id

	// 	console.log('	req.session.userId:::')
	// 	console.log(req.session.userId)
	// };


    // const instance = yield Atwork_Tool.getAtworkInstance(req.session.account);
    // const employeeInfo = yield instance.getEmployeeById(req.session.userId);
    // employeeInfo.org_id = employeeInfo.org_code;
    // account = yield AccountDao.updateAccount(employeeInfo);
    // cacheUser(employeeInfo);

	return { regenSession, cacheUser, justLogin }
};
module.exports = session
	
		// req.session.account = {
		// 	account: account._id,
		// 	domainId: employeeInfo.domain_id,
		// 	orgId: employeeInfo.org_id
		// };
		// req.session.nickname = employeeInfo.nickname;
		// req.session.accountId = account._id;、
        // console.log('----employeeInfo----')
        // console.log(employeeInfo)
