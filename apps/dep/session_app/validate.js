'use strict';

const co = require('co');
const assert = require('assert');
const HandleRes = require('../../utils/handle_res');
const Atwork_Tool = require('../../utils/atwork_tool');
// const AccountDao = require("../daos/account_dao");

const validate = co.wrap(function*(req, res){ //function(req, res) {
	const client = HandleRes.getResFn(res);

	const checkParam = function() {
		assert(req.body.user_id, 'userId不能为空');
		assert(req.body.domain_id, 'domainId不能为空');
		assert(req.body.org_id, 'orgId不能为空');
		assert(req.body.ticket, 'ticket不能为空');
	}
	try {
		checkParam();
	} catch (e) {
		console.error(e);
		client.fail(new Error('e_params'));
		return;
	}


	// 进行ticket验证，校验身份的有效性
	const ctx = {
		domainId: req.body.domain_id,
		orgId: req.body.org_id
	};
	const validateUserTicket = function() {
		//req.session.account = null;
		console.log(' ********* 验证ticket ********* ')
		return Atwork_Tool.getAtworkInstance(ctx)
			.then(atworkInstance => atworkInstance.validateUserTicket(req.body.ticket, req.body.user_id));
	};


	// const validateTicketAndLogin = co.wrap(function*(){//function() {
	// 	// co(function*() {
	// 		const employeeInfo = yield validateUserTicket();
	// 		console.log(' ********* 验证完之后拿回的用户信息 ********* ', employeeInfo)
	// 		// account = yield AccountDao.updateAccount(employeeInfo);
	// 		// console.log('account ********* ', account)
	// 		yield regenSession();
	// 		cacheUser(employeeInfo);
	// 		client.success(employeeInfo);
	// 	// }).catch(client.fail);
	// })
	// const employeeInfo = ;

	// validateTicketAndLogin()
	return yield validateUserTicket()
})
module.exports = validate