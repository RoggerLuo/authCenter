'use strict';

const mongoose = require('mongoose');
const Account = mongoose.model('Account');
const Db_Tool = require('../utils/db_tool');
const findOneAndUpdate = Db_Tool.findOneAndUpdate.bind(Account);

const updateAccount = function(employee) {
	const option = {
		upsert: true,
		new: true
	};
	const condition = {
		domainId: employee.domain_id,
		orgId: employee.org_id,
		username: employee.user_id
	};
	const update = {
		name: employee.name,
		nickname: employee.nickname,
		avatar: employee.avatar
	};
	return findOneAndUpdate(condition, update, option);
};

module.exports = {
	updateAccount
};