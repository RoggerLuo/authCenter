const mongoose = require("mongoose")
const {getDao} = require('../../utils/dao')
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
mongoose.model(modelName, new mongoose.Schema(prototype))
module.exports = getDao(modelName)