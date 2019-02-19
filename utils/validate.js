'use strict';

const crypto = require("crypto");
const mongoose = require('mongoose');
const HandleRes = require('../utils/handle_res');
const EscapeInput = require("../utils/escape");
// const ApplicationDao = require('../daos/application_dao');
// const BugDao = require('../daos/bug_dao');

const isParamsLost = function(requires, params) {
	requires = requires || [];
	params = params || {};
	return _.forEach(requires, function(reqParam){
		// console.log('==========================')
		// console.log(reqParam, params[reqParam])
		// console.log('==========================')
		if(!params[reqParam]){
			throw new Error('e_params');
		}
	});
};

const hashSha256 = function(raw) {
	const sha256 = crypto.createHash("sha256");
	let result = [];
	let total = 0;

	sha256.setDefaultEncoding("utf-8");
	sha256.end(raw);
	sha256.on("data", buffer => {
		result.push(buffer);
		total += buffer.length;
	});
	return new Promise((success, fail) => {
		sha256.on("end", () => {
			const str = Buffer.concat(result, total).toString("hex");
			//console.log("读取完毕，sha256之后的数据是", str);
			success(str);
		});
		sha256.on("error", e => {
			console.error("sha256出错", e);
			fail(e);
		});
	});
};

const isFalsified = function(req, res, next) {
	if (process.env.amitabha) {
		next();
		return;
	}
	const escapeChar = function() {
		req.body = EscapeInput.escapeObj(req.body);
	};
	const client = tool.getResponseFunc(res);
	const compareTo = req.get("expire-day");
	if (!compareTo) {
		console.error("没有检验头", req.originalUrl);
		client.fail(new Error("e_falsified"));
		return;
	}
	const text = Object.keys(req.body).length ?
		JSON.stringify(req.body) :
		"";
	const raw = text + decodeURI(req.originalUrl) + "Bug CCCatcher";
	return hashSha256(raw)
		.then(afterHash => {
			if (afterHash !== compareTo) {
				console.error("企图攻击？！", req.originalUrl, afterHash, compareTo);
				const e = new Error("e_falsified");
				client.fail(e);
				throw e;
			}
		})
		.then(escapeChar)
		.then(next);

};

const getThisId = function(idStr, req) {
	switch (idStr) {
		case 'req.query.appId':
			return req.query.appId;
		case 'req.params.appId':
			return req.params.appId;
		case 'req.params.bugId':
			return req.params.bugId;
		case 'req.params.id':
			return req.params.id;
		default:
			console.error('id获取失败', idStr);
			throw new Error('e_code');
	}
};

const isAppExisted = function(appIdStr) {
	return function(req, res, next) {
		const appId = getThisId(appIdStr, req);
		const client = HandleRes.getResFn(res);
		if (!appId) {
			client.fail(new Error('e_params'));
			return;
		}
		if (!mongoose.Types.ObjectId.isValid(appId)) {
			client.fail(new Error('e_find_no_app'));
			return;
		}
		// ApplicationDao.getAppById(appId)
		// 	.then(app => {
		// 		if (app) {
		// 			req.app = app;
		// 			next();
		// 		} else {
		// 			console.error('应用不存在');
		// 			client.fail(new Error('e_find_no_app'));
		// 		}
		// 	}).catch(e => console.error(e));
	};
};

// const isBugExisted = function(appIdStr, bugIdStr) {
// 	return function(req, res, next) {
// 		const appId = getThisId(appIdStr, req);
// 		const bugId = getThisId(bugIdStr, req);
// 		const client = HandleRes.getResFn(res);
// 		if (!appId || !bugId) {
// 			client.fail(new Error('e_params'));
// 			return;
// 		}
// 		if (!mongoose.Types.ObjectId.isValid(appId) || !mongoose.Types.ObjectId.isValid(bugId)) {
// 			client.fail(new Error('e_find_no_bug'));
// 			return;
// 		}
// 		BugDao.getBugById(bugId)
// 			.then(bug => {
// 				if (bug) {
// 					req.bug = bug;
// 					next();
// 				} else {
// 					console.error('应用错误不存在');
// 					client.fail(new Error('e_find_no_bug'));
// 				}
// 			}).catch(e => console.error(e));
// 	};
// };

module.exports = {
	isParamsLost,
	isAppExisted,
	// isBugExisted,
};