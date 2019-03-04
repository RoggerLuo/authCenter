const mongoose = require("mongoose")
const {getModelMethods} = require('../../utils/dao')
const modelName = "note"
const prototype = {
    content: String,
    modifyTime: Number,
    createTime: Number,
    username: String,
    starred: Boolean,
    status: Number,
    wordList: []
}

module.exports = getModelMethods(mongoose.model(modelName, new mongoose.Schema(prototype)))