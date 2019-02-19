"use strict";

const getOrgInfo = function(orgId) {
	const send = require("./send_request").bind(this);
	const options = {
		url: `${this.adminServer}/admin/organizations/${orgId}/view`,
		json: true
	};
	return send(options);
};
const getOrgSettingInfo = function(orgId) {
	const send = require("./send_request").bind(this);
	const options = {
		url: `${this.adminServer}/admin/organizations/${orgId}/settings`,
		json: true
	};
	return send(options);
};
module.exports = function(context) {
	return {
		getOrgInfo: getOrgInfo.bind(context),
		getOrgSettingInfo: getOrgSettingInfo.bind(context)
	};
};