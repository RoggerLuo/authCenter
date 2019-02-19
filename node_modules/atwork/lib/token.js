"use strict";
const statndardTokenModule = require("./standard_token");
const isvTokenModule = require("./isv_token");
//增加对isv的支持，
//如果是isv情况，则token和adminServer都是由外部传入，
//否则则走传统路线，去相关的地方申请
const getTokenModuleByType = function(context) {
	if (context.token && context.adminServer) {
		return isvTokenModule(context);
	} else {
		return statndardTokenModule(context);
	}
};
module.exports = getTokenModuleByType;