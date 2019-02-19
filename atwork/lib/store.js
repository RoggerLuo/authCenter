"use strict";
const mime = require("mime-types");
const fs = require("fs");
const assert = require("assert");
const getFileType = function(file) {
	const mimeType = mime.lookup(file);
	return mimeType;
};
const getFormData = function(file, mimeType) {
	return {
		file: {
			value: fs.createReadStream(file.path),
			options: {
				filename: file.originalname,
				contentType: mimeType
			}
		}
	};
};
const getFileSize = function(file) {
	return new Promise((success, fail) => {
		fs.stat(file, (e, stat) => {
			if (e) {
				console.error("读取文件信息出错", e);
				fail(e);
			} else {
				success(stat.size);
			}
		});
	});
};
const checkParam = function(file) {
	assert(file, "file can't be null");
	assert(file.path, "file.path can't be null");
	assert(file.originalFilename, "file.originalname can't be null");
};
const reThrow = function(e) {
	console.error("重抛异常", e, e.stack);
	throw new Error("上传失败");
};
const uploadImage = function(file) {
	checkParam(file);
	const mimeType = getFileType(file.path);
	if (mimeType === false) {
		console.error("未知的图片类型");
		return Promise.resolve(new Error("unknown image type"));
	}
	const getOptions = fileSize => {
		return () => {
			return {
				method: "POST",
				url: `${this.adminServer}/medias/images?file_size=${fileSize}`,
				formData: getFormData(file, mimeType),
				json: true
			};
		};

	};
	const send = require("./send_request").bind(this);
	return getFileSize(file.path)
		.then(getOptions)
		.then(send)
		.catch(reThrow);

};

const uploadFile = function(file) {
	checkParam(file);
	const mimeType = getFileType(file.path) || "application/octet-stream";
	
	const getOptions = fileSize => {

		return () => {
			return {
				method: "POST",
				url: `${this.adminServer}/medias?&file_size=${fileSize}`,
				formData: getFormData(file, mimeType),
				json: true
			};
		};
	};
	const send = require("./send_request").bind(this);
	return getFileSize(file.path)
		.then(getOptions)
		.then(send)
		.catch(reThrow);
};

const getImageLink = function(image) {
	if (!image) {
		throw new Error("image obj can't be null");
	}
	if (!image.id) {
		throw new Error("image id can't be null");
	}
	const fileId = image.id;
	const quality = image.quality ? `&quality=${image.quality}` : "";
	const rotate = image.rotate ? `&rotate=${image.rotate}` : "";
	const width = image.width ? `&width=${image.width}` : "";
	const height = image.height ? `&height=${image.height}` : "";
	const url = `${this.adminServer}/medias/${fileId}?1=1${quality}${rotate}${width}${height}`;
	return url;
};
const translate = function(srcType, destType, mediaId) {
	if (!srcType || !destType) {
		throw new Error("type can't be null");
	}
	if (!mediaId) {
		throw new Error("mediaId can't be null");
	}
	const url = `${this.adminServer}/medias/${mediaId}/translate?source_type=${srcType}&dest_type=${destType}`;
	const options = {
		url,
		json: true
	};
	const send = require("./send_request").bind(this);
	return send(options);

};
module.exports = function(context) {
	return {
		uploadImage: uploadImage.bind(context),
		uploadFile: uploadFile.bind(context),
		getImageLink: getImageLink.bind(context),
		translate: translate.bind(context)
	};
};