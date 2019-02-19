"use strict";

const validateUserTicket = function(ticket, username) {
	const send = require("./send_request").bind(this);
	const options = {
		url: `${this.adminServer}/tickets/${ticket}`,
		json: true
	};
	const isYourTicket = response => {
		const user = require("./employee")(this);
		const ticket = response.result;
		return user.getEmployeeById(ticket.client_id).then(employeeInfo => { //现在兼容传userId和usernname进行对比
			if ((employeeInfo.username !== username && employeeInfo.user_id !== username) ||
				ticket.org_id !== this.orgId) {
				console.error("信息不一致，ticket被盗用？", employeeInfo, username, ticket.org_id, this.orgId);
				//throw new Error("e_validate_ticket");不再校验ticket有效性
			}
			return Object.assign({}, ticket, employeeInfo);
		});
	};
	return send(options).then(isYourTicket);
};

module.exports = function(context) {
	return {
		validateUserTicket: validateUserTicket.bind(context)
	};
};