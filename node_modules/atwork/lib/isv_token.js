"use strict";

const tokens = {};
//	token的几种状态:
const READY = "token ready"; //可用
const PENDING = "pending previous application"; //等待之前的申请完成
const FROZEN = "frozen time"; //之前的申请失败过多，进入冷冻期，冷冻期维持10秒
const getAccessTokenKey = function() { //支持多个应用同时使用同一个atwork实例
	return `${this.domainId}_${this.orgId}_${this.suiteKey}`;
};


const storeToken = function(key, token, status) {
	tokens[key] = {
		status,
		token
	};
	return token;
};
const applyForToken = function() {
	const key = getAccessTokenKey.call(this);
	storeToken(key, null, PENDING);
	return this.getAccessToken()
		.then(token => storeToken(key, token, READY))
		.then(token => token.api_access_token)
		.catch(e => {
			storeToken(key, null, FROZEN);
			setTimeout(() => delete tokens[key], 5000); //失败一次就立即进入冷冻期，5秒后修改状态自动解除
			throw e;
		});
};

const resetToken = function() { //强制刷新token
	const key = getAccessTokenKey.call(this);
	const tokenObj = tokens[key];
	if (!tokenObj) {
		console.log("没有token，直接申请");
		tokens[key] = {
			status: PENDING
		};
		return applyForToken.call(this);
	}
	if (tokenObj.status === READY) {
		console.warn("等待完毕，使用别人申请到的token", tokenObj.token.api_access_token);
		return Promise.resolve(tokenObj.token.api_access_token);
	}
	if (tokenObj.status === PENDING) {
		console.warn("等待token申请完成，无需重新申请");
		return new Promise(success => {
			setTimeout(() => success(resetToken.call(this)), 3000);
		});
	}
	if (tokenObj.status === FROZEN) {
		console.error("进入冷冻期，申请token失败");
		return Promise.reject(new Error(FROZEN));
	}
};


const getAccessToken = function() { //异步申请token，如果有缓存的话会优先使用缓存
	const key = getAccessTokenKey.call(this);
	const token = tokens[key];
	if (token && token.status === READY) {
		console.log("使用缓存token", token);
		return Promise.resolve(token.token.api_access_token);
	} else {
		return resetToken.call(this);
	}
};
const deleteToken = function() {
	delete tokens[getAccessTokenKey.call(this)];
	return tokens;
};
const isTokenExist = function(domainId, orgId, suiteKey) {
	return tokens[`${domainId}_${orgId}_${suiteKey}`];
};
module.exports = function(param) {
	return {
		getAccessToken: getAccessToken.bind(param),
		applyForToken: applyForToken.bind(param),
		deleteToken: deleteToken.bind(param),
		isTokenExist
	};
};