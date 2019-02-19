"use strict";


const notify = function(body) {
	const send = require("./send_request").bind(this);
	const options = {
		method: "POST",
		url: `${this.adminServer}/apps/mbox?source_type=${this.sourceType}&app_id=${this.clientId}`,
		json: true,
		body: body
	};
	return send(options);
};

const notifyWithText = function(param) {
	const body = {
		type: "TEXT",
		client_ids: param.users,
		body: {
			org_id_: this.orgId,
			content: param.content,
			"@target_url": param.targetUrl, //这个参数决定它会在会话列表打开应用，例如移动打卡的消息通知就需要从列表那里直接跳进去
			display_mode: param.displayMode || "FULL_SCREEN"
		}
	};
	if (!param.targetUrl) delete body.body["@target_url"];
	return notify.call(this, body);
};

const notifyWithImageText = function(param) {
	const body = {
		type: "article",
		client_ids: param.users,
		body: {
			org_id_: this.orgId,
			articles: [{
				show_cover: true,
				create_time: new Date().getTime(),
				author: "",
				sort: 0,
				title: param.title || "", //title会显示在头部
				summary: param.description, //summary会显示在底部
				content: param.description || "", //content只有在进入后台的图文列表才会显示，因此对轻应用作用不大
				url: param.url, //在消息列表时候点击跳转的url，与下面的@target_url区别是@target_url是在会话列表时候的跳转
				cover_url: param.coverUrl, //如果图文消息的图片是url的形式存在，优先判断这个，如果为空的时候再判断media id
				cover_media_id: param.coverMediaID, //如果图文消息的图片以media id的形式存在
				display_mode: param.displayMode || "FULL_SCREEN"
					//"content_source: param.url, 这个属性貌似没有人用了，先注释掉
			}]
		}
	};
	return notify.call(this, body);
};

module.exports = function(context) {
	console.log(context);
	return {
		notifyWithText: notifyWithText.bind(context),
		notifyWithImageText: notifyWithImageText.bind(context)
	};
};