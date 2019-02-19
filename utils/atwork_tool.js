'use strict';

const atwork = require('../atwork');
const isv = require('isv-client');
const config = require('../config').workplus;

const getAtworkSimpleInstance = function(ctx) {
	const param = {
		clientId: config.clientId,
		clientSecret: config.clientSecret,
		adminServer: config.apiServer.internal,
		domainId: ctx.domainId,
		orgId: ctx.orgId
	};
	const instance = atwork(param);
	return Promise.resolve(instance);
};

const getAtworkIsvInstance = function(ctx) {
	const getBaseParam = function() {
		return {
			suiteKey: config.suiteKey,
			suiteSecret: config.suiteSecret,
			domainId: ctx.domainId,
			orgId: ctx.orgId,
			appId: config.appId,
			isvServer: config.isvServer
		};
	};
	const getParamForIsvInstance = function(result) {
		console.log("boss平台返回的token是", result);
		return Object.assign({
			adminServer: result.access_endpoint,
			token: result.api_access_token,
			getAccessToken: isvClient.getContacts.bind(isvClient)
		}, baseParam);
	};

	const baseParam = getBaseParam();
	const isvClient = isv(baseParam);
	let cacheToken = atwork.isTokenExist("isv", baseParam.domainId, baseParam.orgId, baseParam.suiteKey);
	if (cacheToken) { //token存在的情况下不用去isv client重新申请token
		console.log("atwork包找到该缓存", cacheToken.token);
		const instance = atwork(getParamForIsvInstance(cacheToken.token));
		return Promise.resolve(instance);
	} else {
		return isvClient.getContacts().then(getParamForIsvInstance).then(atwork);
	}
};

const getAtworkInstance = function(ctx) {
	if (!ctx || !ctx.domainId || !ctx.orgId) {
		console.error("参数不足", ctx);
		throw new Error("e_params");
	}
	if (config.suiteKey) {
		return getAtworkIsvInstance(ctx);
	} else {
		return getAtworkSimpleInstance(ctx);
	}
};

module.exports = {
	getAtworkInstance,
};