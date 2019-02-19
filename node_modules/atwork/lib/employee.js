"use strict";
const getEmployeeById = function(userId) { //验证ticket的
	const send = require("./send_request").bind(this);
	const options = {
		url: `${this.adminServer}/admin/organizations/${this.orgId}/employees/${userId}?type=user`,
		json: true,
		Accept: "application/json"
	};
	return send(options).then(response => response.result);
};
const searchForEmployee = function(keyword) {
	const send = require("./send_request").bind(this);
	const options = {//会查询name username 拼音 字符缩写等字段，反正就是万能
		url: `${this.adminServer}/admin/organizations/${this.orgId}/employees?query=${keyword}`,
		json: true
	};
	return send(options);
};
module.exports = function(context) {
	return {
		getEmployeeById: getEmployeeById.bind(context),
		searchForEmployee: searchForEmployee.bind(context)
	};
};