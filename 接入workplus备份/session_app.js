'use strict';

const co = require('co');
const assert = require('assert');
const HandleRes = require('../utils/handle_res');
const Atwork_Tool = require('../utils/atwork_tool');
const AccountDao = require("../daos/account_dao");

const createSession = function(req, res) {
	const client = HandleRes.getResFn(res);
	const ctx = {
		domainId: req.body.domainId,
		orgId: req.body.orgId
	};
	let account;

	const checkParam = function() {
		assert(req.params.userId, 'userId不能为空');
		assert(req.body.domainId, 'domainId不能为空');
		assert(req.body.orgId, 'orgId不能为空');
		assert(req.body.ticket, 'ticket不能为空');
	};

	try {
		checkParam();
	} catch (e) {
		console.error(e);
		client.fail(new Error('e_params'));
		return;
	}

	// 进行ticket验证，校验身份的有效性
	const validateUserTicket = function() {
		//req.session.account = null;
		console.log(' ********* 验证ticket ********* ')
		return Atwork_Tool.getAtworkInstance(ctx)
			.then(atworkInstance => atworkInstance.validateUserTicket(req.body.ticket, req.params.userId));
	};

	// 理论上每次用户登录都意味着开启了一个新的session，因此需要重新生成新的sid
	const regenSession = function() {
		return new Promise((success, fail) => {
			req.session.regenerate(function(e) {
				if (e) {
					console.error('重新生成sid失败', e);
					fail(new Error('e_session'));
				} else {
					success();
				}
			});
		});
	};

	// 把登录用户的信息存储到session里
	const cacheUser = function(employeeInfo) {
		req.session.account = {
			account: account._id,
			domainId: employeeInfo.domain_id,
			orgId: employeeInfo.org_id
		};
		req.session.nickname = employeeInfo.nickname;
		req.session.name = employeeInfo.name;
		req.session.accountId = account._id;
		req.session.userId = account.username;
	};

	const validateTicketAndLogin = function() {
		co(function*() {
			const employeeInfo = yield validateUserTicket();
			console.log(' ********* 验证完之后拿回的用户信息 ********* ', employeeInfo)
			account = yield AccountDao.updateAccount(employeeInfo);
			console.log('account ********* ', account)
			yield regenSession();
			cacheUser(employeeInfo);
			client.success(employeeInfo);
		}).catch(client.fail);
	};

	const justLogin = function() {
		co(function*() {
			const instance = yield Atwork_Tool.getAtworkInstance(req.session.account);
			const employeeInfo = yield instance.getEmployeeById(req.session.userId);
			employeeInfo.org_id = employeeInfo.org_code;
			account = yield AccountDao.updateAccount(employeeInfo);
			cacheUser(employeeInfo);
			req.session.touch(); //延长登录时间
			client.success(employeeInfo);
		}).catch(client.fail);
	};

	if (req.session.account &&
		req.session.userId === req.params.userId &&
		req.session.account.domainId === req.body.domainId &&
		req.session.account.orgId === req.body.orgId
	) { //如果已经登录过，则无需再验证ticket
		//之前传的是username，但是现在已经成了userId了
		console.log('延长登录时间');
		justLogin();
	} else {
		validateTicketAndLogin();
	}

};

module.exports = {
	createSession,
};