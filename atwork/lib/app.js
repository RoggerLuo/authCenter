"use strict";

const isUserOfThisApp = function(keyWord) {
	const send = require("./send_request").bind(this);
	const options = {
		url: `${this.adminServer}/apps/${this.clientId}/scope-employees?name=${keyWord}&source_type=${this.sourceType}`,
		json: true
	};
	return send(options);
};
const isAdminOfThisApp = function(keyWord) {
	const send = require("./send_request").bind(this);
	const options = {
		url: `${this.adminServer}/apps/${this.clientId}/admins?name=${keyWord}&source_type=${this.sourceType}`,
		json: true
	};
	return send(options);
};
module.exports = function(context) {
/*	if (context.isIsv) {
		context.sourceType = "ISV";
		context.clientId = context.appId; //isv的情况下clientId的值为appId
	} else {
		context.sourceType = "NATIVE";
	}*/
	return {
		isUserOfThisApp: isUserOfThisApp.bind(context),
		isAdminOfThisApp: isAdminOfThisApp.bind(context)
	};
};