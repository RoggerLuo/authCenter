'use strict';
const co = require('co');
const mongoose = require('mongoose');
const uuid = require('node-uuid');
const getUserAgent = require('../utils/tools').getUserAgent;
const HandleRes = require('../utils/handle_res');
const Validate = require('../utils/validate');
const DetailDao = require('../daos/detail_dao');
const Atwork_Tool = require('../utils/atwork_tool'); //包atwork/lib/store里的checkParam的originalFilename名字需要改一下
const ctx = require('../config.js').ctx
const uploadMediaServer = (inputFile,req) => {
	console.log(' ********* 上传媒体库 ********* ')
	return Atwork_Tool.getAtworkInstance(ctx)
        .then(atworkInstance => atworkInstance.uploadFile(inputFile))
        .then(backMessage => backMessage.result)
}
const fs = require('fs')
const AdmZip = require('../adm-zip')
function guid() {
    return 'xxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
        return v.toString(16)
    });
}
function ifzip(inputFile,client){
	return new Promise(resolve => {
		const uploadedPath = inputFile.path;
        const path = process.cwd()
        const relativePath = `/uploadRepo/${guid()}/`
		const dstPath = path+relativePath //+ inputFile.originalFilename     
        console.log(dstPath)
        var zip = new AdmZip(uploadedPath)
        var zipEntries = zip.getEntries()
        console.log(zipEntries[0].toString())
        zip.extractAllTo( dstPath )
        resolve(relativePath + zipEntries[0].entryName.slice(0,-1) )//inputFile.originalFilename.slice(0,-4)   
	})
}
function ifPdf(inputFile,client,mediaId){
    return new Promise(resolve => {
        const uploadedPath = inputFile.path
        const path = process.cwd()
        const relativePath = `/uploadRepo/pdf/`
        const dstFolder = path+relativePath 
        if(!fs.existsSync(dstFolder)){ //同步创建folder
            fs.mkdirSync(dstFolder)
        }
        const dstPath = dstFolder + mediaId
        fs.rename(uploadedPath, dstPath, function(err) { // fs.rename之后，原始的上传文件就会被移走了
            if(err) {
                console.log('rename error:' + err);
            }else {
                inputFile.path = dstPath
                resolve(dstPath) 
                console.log('rename ok');
            }
        })
    })
}
// const host = require('../config.js').host
function upload(req, res) {
    console.log('********uploaduploadupload********')
    const client = HandleRes.getResFn(res);
    const inputFile = req.files.file
    if(inputFile==undefined) {
        client.fail('catch unknow error,undefined file')
    }
    const suffix = /[^\.]+$/.exec(inputFile.originalFilename);
    const rParams = ['ownerName','appId','ownerId','fileName','fileType','fileSize','father']
    const params = {
    	appId: req.body.appId,
    	father: req.body.father,
    	ownerName: req.session.nickname,
        ownerId: req.session.userId,
        fileName: inputFile.originalFilename,
        fileType: inputFile.type,
        fileSize: inputFile.size
    }
    co(function*() {
    	yield Validate.isParamsLost(rParams, params)
    	if(req.body.isPages){
    		const link = yield ifzip(inputFile,client) 
            params.fileName = params.fileName//.slice(0,-4)
            params.fileType = 'webPage'
            params.link = link 
    	}
	 	params.mediaId = yield uploadMediaServer(inputFile,req)
        if(req.body.isPdf){ // 放在uploadMediaServer之后才能拿到mediaId
            const link = yield ifPdf(inputFile,client,params.mediaId) // 本地放一份，用来预览; 媒体服务器放一份，用来下载
            params.fileName = params.fileName
            params.fileType = 'pdf'
            params.link = link 
        }
        console.log('-------replaceId-------')
        console.log(req.body.replaceId)
        if(req.body.replaceId){
            params._id = req.body.replaceId
            yield DetailDao.updateFile(params)            
        }else{
            const insertedFileEntry = yield DetailDao.createFile(params)            
        }
        client.success('ok')
    }).catch(client.fail);    
}

module.exports = upload
