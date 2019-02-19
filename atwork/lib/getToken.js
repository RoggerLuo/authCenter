"use strict";
const request = require("request");
const timeout = 10000;
const util = require("util");
const config = {
	depth: 3
};
const MAX_RETRIES = 2;
const retryTooMuch = function() {
	console.error("重试次数过多");
	this.fail(new Error("fail_too_much"));
};
const responseIsNotJson = function() {
	console.error("服务器没有返回json");
	this.fail(new Error("response is not json"));
};
const statusIsNotZero = function(status) {
	console.error("服务器返回值非0", status);
	this.fail(new Error("api server error"));
};
const retry = function() {
	console.error("token过期或者not found，准备删除旧token重新申请", this.rawOptions, this.retries);
	//require("./token")().deleteToken(`${this.domainId}_${this.orgId}`); //删除掉这个已经过期的token
	require("./token")(this).deleteToken();
	this.rawOptions.isRetried = true;
	this.success(send.call(this, this.rawOptions, --this.retries)); //递归重试，最终的成功失败将由这个新返回的promise确定
};
const parseServerResponse = function(body) {
	console.log("\n服务器响应是\n", body);
	if (this.retries <= 0) {
		retryTooMuch.call(this);
	} else if (body === undefined || body.status === undefined) {
		responseIsNotJson.call(this);
	} else if ((body.status === 10011 || body.status === 10013) && this.retries > 0) {
		retry.call(this);
	} else if (body.status !== 0) {
		statusIsNotZero.call(this, body.status);
	} else {
		this.success(body);
	}
};
const networkError = function(e) {
	console.error("网络错误", e);
	this.fail(e);
};
const getOptions = function(token) {
	//这个操蛋的处理是因为，文件上传的时候，option里面对应的流回被消费掉，导致重试的时候，服务端会一直在等待流而导致超时
	//因此options在文件上传的时候不能以对象的方式传进来，需要用函数的方式传进来，每次执行函数的时候重建stream

	let options;
	if (this.rawOptions.constructor === Function) {
		options = this.rawOptions();
	} else {
		options = this.rawOptions;
	}
	options.timeout = timeout;
	if (this.rawOptions.isRetried) { //说明是token not found导致的重试，此时需要替换掉旧的token的值
		let index = options.url.indexOf("access_token");
		index = index > 0 ? index - 1 : options.url.length;
		options.url = options.url.substring(0, index);
		//console.log("重试吗？重试吗？重试吗？重试吗？重试吗？重试吗？重试吗？重试吗？重试", this.retries, index, options.url);
	}
	if (options.url.indexOf("?") > 0) { //所有url都需要添加access token
		options.url += `&access_token=${token}`;
	} else {
		options.url += `?access_token=${token}`;
	}
	options.url = encodeURI(options.url);
	return options;
};
const send = function send(rawOptions, retries = MAX_RETRIES) {
	const tokenModule = require("./token")(this);
	// const doSendRequest = token => {
	// 	console.log("已经获得token，开始发送请求", token);
	// 	return new Promise((success, fail) => {
	// 		const ctx = {
	// 			rawOptions,
	// 			success,
	// 			fail,
	// 			retries
	// 		};
	// 		const options = getOptions.call(ctx, token);
	// 		console.log("请求的参数是\n", util.inspect(options, config));
	// 		request(options, (e, res, body) => {
	// 			if (e) {
	// 				networkError.call(ctx, e);
	// 			} else {
	// 				parseServerResponse.call(Object.assign({}, this, ctx), body);
	// 			}
	// 		});
	// 	});
	// };
	return tokenModule.getAccessToken();
};
/*
send 方法就只接受一个option参数，这个option参数包括
	orgid：
	clientId:  
	clientSecret:  
	domainId:  
	adminServer:  管理后台的url
*/
module.exports = send;