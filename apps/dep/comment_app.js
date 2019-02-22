'use strict';
const co = require('co');
const mongoose = require('mongoose');
const uuid = require('node-uuid');
const getUserAgent = require('../utils/tools').getUserAgent;
const HandleRes = require('../utils/handle_res');
const Validate = require('../utils/validate');
const CommentDao = require('../daos/comment_dao');
const upload_sub_app = require('./upload_sub_app');

function getCommentList(req, res) { 
    const client = HandleRes.getResFn(res);
    co(function*() {
        const rParams = ['dirId']
        let params = Object.assign({}, req.params, req.query);
        yield Validate.isParamsLost(rParams, params);
        let list = yield CommentDao.getListById(params);
        client.success(list);
    }).catch(client.fail);
}
const createComment = function(req, res) {
    const client = HandleRes.getResFn(res);
    co(function*() {
        const rParams = ['content','dirId','ownerId'];
        const other = {
            owner: req.session.nickname,//||req.body.anonymity||''
            ownerId: req.session.userId,
        }
        const params = Object.assign({}, req.params, req.body, other)
        yield Validate.isParamsLost(rParams, params);
        let ok = yield CommentDao.createComment(params);
        client.success(ok);
    }).catch(client.fail)
}
const createDir = function(req, res) {
    const client = HandleRes.getResFn(res);
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
        let ok = yield CommentDao.createDir(params);
        client.success(ok);
    }).catch(client.fail)
}

const deleteComment = function(req, res) {
    const client = HandleRes.getResFn(res);
    co(function*() {
        let rParams = ['commentId', 'ownerId'];
        let params = Object.assign({}, req.params, req.body)
        params.ownerId = req.session.userId
        yield Validate.isParamsLost(rParams, params)
        let ok = yield CommentDao.deleteById(params.commentId,params.ownerId)
        client.success(ok)
    }).catch(client.fail)
}

const uploadFile = upload_sub_app

module.exports = {
    getCommentList,
    createComment,
    deleteComment
}
