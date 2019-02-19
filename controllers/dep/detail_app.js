'use strict';
const fs = require('fs')
const https = require('https')
const path = require('path')
const co = require('co');
const mongoose = require('mongoose');
const uuid = require('node-uuid');
const getUserAgent = require('../utils/tools').getUserAgent;
const HandleRes = require('../utils/handle_res');
const Validate = require('../utils/validate');
const DetailDao = require('../daos/detail_dao');
const upload_sub_app = require('./upload_sub_app');
const ctx = require('../config.js').ctx

const ShortcutsDao = require('../daos/Shortcuts_dao')
const { weightModifier,groupByOperation,objToArr,sortAndCutArr,fillDetailInfo,handleMsOffice } = require('./shortcuts_sub_app')

// let http = require("https");

function downloadToLocal(mediaId,realPath,cb){
    let url = 'https://api4.workplus.io/v1/medias/' + mediaId
    https.get(url, function(__res){
        let fileData = "";
        let contentLength = parseInt(__res.headers['content-length']);
        //总长度       
        // console.log(contentLength);
        __res.setEncoding("binary");
        __res.on("data", function(chunk){
            fileData+=chunk;
            let _process = ((fileData.length)/contentLength) * 100;
            let percent = parseInt(((_process).toFixed(0)));
    //任务栏进度条
            console.log(percent);
                        
        });
        __res.on("end", function(){
            fs.writeFile(realPath, fileData, "binary", function(err){
                if(err){
                    console.log("down fail");
                }else{
                    cb && cb()
                    console.log("down success")
                }
            })
        })
    })
}

const previewPdf = function(req, res) { // 文件中转代理
    const client = HandleRes.getResFn(res);
    if(!req.session.userId){
        client.success('PleaseLogIn')
        return
    }
    co(function*() {
        const mediaId = req.params.mediaId // 在请求url的query中传入mediaId
        const path = process.cwd() 
        const realPath = path + '/uploadRepo/pdf/' + mediaId // 使用mediaId来命名的文件
        
        if(!fs.existsSync(realPath)){ 
            downloadToLocal(mediaId,realPath,()=>sendFile()) // 下载到本地是为了兼容旧数据，只存在媒体服务器的pdf
        }else{
            sendFile()
        }
        function sendFile(){
            fs.readFile(realPath, "binary", function (err, file) { 
                if (err) {
                    console.log(err)
                    res.writeHead(500, { 'Content-Type': 'text/plain' })
                    res.end(err.message)
                    return
                }
                res.set('Content-Disposition',"inline;filename=" + new String('preview',"utf-8")) // 预览方式打开pdf的关键
                res.writeHead(200, { 'Content-Type': "application/pdf" })
                res.write(file, "binary")
                res.end()
            })            
        }
    }).catch(client.fail)
}

const getShortcuts = function(req, res) {
    const client = HandleRes.getResFn(res);
    if(!req.session.userId){
        client.success('PleaseLogIn')
        return
    }
    co(function*() {
        const rParams = ['appId'];
        const params = Object.assign({}, req.params, req.body)
        yield Validate.isParamsLost(rParams, params);
        let days = 14
        if(req.session.userId) params.userId = req.session.userId
        const token = yield Atwork_Tool.getAtworkInstance(ctx)
            .then(atworkInstance => atworkInstance.getToken())
        let data = yield ShortcutsDao.getLogs(params,days)
            .then(groupByOperation)
            .then(objToArr)
            .then(sortAndCutArr)
            .then(fillDetailInfo)
            .then(handleMsOffice(token))
            .then(weightModifier)

        client.success(data)
    }).catch(client.fail)
}
const insertOneLog  = function(req, res) {
    const client = HandleRes.getResFn(res);
    co(function*() {
        const rParams = ['fileId','userId','appId'];
        const other = { userId: req.session.userId||'visitor' }
        const params = Object.assign({}, req.params, req.body, other)
        yield Validate.isParamsLost(rParams, params);
        let ok = yield ShortcutsDao.insertLog(params);
        client.success(ok);
    }).catch(client.fail)
}

const Atwork_Tool = require('../utils/atwork_tool'); //包atwork/lib/store里的checkParam的originalFilename名字需要改一下

// function getFileNameByMediaId(mediaId){
//     return mediaId
// }
function download(req, res) {
    const client = HandleRes.getResFn(res);
    if(!req.session.userId){
        client.success('PleaseLogIn')
        return
    }

    co(function*() {
        let fileName = yield DetailDao.getFileNameByMediaId(req.params.mediaId)
        fileName = encodeURI(fileName) 

        const token = yield Atwork_Tool.getAtworkInstance(ctx)
            .then(atworkInstance => atworkInstance.getToken())
        var sreq = https.request({
            host:     'api4.workplus.io', 
            path:     '/v1/medias/'+req.params.mediaId+'?access_token='+token, 
            method:   'GET' // 请求方式
        }, function(sres){

            res.header('content-disposition', 'attachment; filename="'+fileName+'"')
            sres.pipe(res);
            sres.on('end', function(){console.log('done')})
        })
        // if (/POST|PUT/i.test(req.method)) {
        //     req.pipe(sreq);
        // } else {
            sreq.end('okok');
        // }
    })

    // return 
    // var fileName = req.params.fileName;
    // var filePath = path.join(__dirname, fileName);
    // var stats = fs.statSync(filePath);
    // if (stats.isFile()) {
    //     res.set({
    //         'Content-Type': 'application/octet-stream',
    //         'Content-Disposition': 'attachment; filename=' + fileName,
    //         'Content-Length': stats.size
    //     });
    //     fs.createReadStream(filePath).pipe(res);
    // } else {
    //     res.end(404);
    // }
}

const createLink = function(req, res) {
    const client = HandleRes.getResFn(res);
    co(function*() {
        const rParams = ['father','fileName','appId','link'];
        const other = {
            ownerName: req.session.nickname,
            ownerId: req.session.userId,
            fileType:'link',
            fileSize: ''
        }
        const params = Object.assign({}, req.params, req.body, other)
        yield Validate.isParamsLost(rParams, params);
        let ok = yield DetailDao.createDir(params);
        client.success(ok);
    }).catch(client.fail)
}
const createDir = function(req, res) {
    const client = HandleRes.getResFn(res);
    if(!req.session.userId){
        client.success('PleaseLogIn')
        return
    }
    co(function*() {
        const rParams = ['father', 'fileName','appId'];
        const other = {
    		ownerName: req.session.nickname,
            ownerId: req.session.userId,
            fileType:'dir',
            fileSize: ''
        }
        const params = Object.assign({}, req.params, req.body, other)
        yield Validate.isParamsLost(rParams, params);
        let ok = yield DetailDao.createDir(params);
        client.success(ok);
    }).catch(client.fail)
}

function getFileList(req, res) { 
    const client = HandleRes.getResFn(res);
    if(!req.session.userId){
        client.success('PleaseLogIn')
        return
    }
    co(function*() {
        const rParams = ['appId','father']
        let params = Object.assign({}, req.params, req.query);
        yield Validate.isParamsLost(rParams, params);
        let list = yield DetailDao.getList(params);
        const token = yield Atwork_Tool.getAtworkInstance(ctx)
            .then(atworkInstance => atworkInstance.getToken())

        // link是在请求列表信息的时候生成的,不是写入的时候
        list = list.map(el=>{
            const suffix = /[^\.]+$/.exec(el.fileName)
            if(suffix == 'docx'||suffix == 'xlsx'||suffix=='pptx'||suffix == 'xls'||suffix=='ppt'||suffix=='doc'){
                el.link = 'https://api4.workplus.io/v1/medias/'+el.mediaId+'?access_token='+token
            }
            if(suffix == 'pdf') {
                el.link = '/detail/pdf/'+el.mediaId
            }
            return el
        })
        client.success(list);
    }).catch(client.fail);
}

const deleteFile = function(req, res) {
    const client = HandleRes.getResFn(res);
    co(function*() {
        let rParams = ['fileId', 'ownerId'];
        let params = Object.assign({}, req.params, req.body)
        params.ownerId = req.session.userId
        yield Validate.isParamsLost(rParams, params)
        let ok = yield DetailDao.deleteFile(params)
        client.success(ok)
    }).catch(client.fail)
};


const uploadFile = upload_sub_app

module.exports = {
    getFileList,
    uploadFile,
    deleteFile,
    createDir,
    download,
    createLink,
    insertOneLog,
    getShortcuts,
    previewPdf,

}


