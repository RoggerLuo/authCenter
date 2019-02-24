const mongoose = require("mongoose")
const modelName = "note"
mongoose.model(modelName, new mongoose.Schema({
    content: String,
    modifyTime: Number,
    createTime: Number,
    username: String,
    starred: Boolean,
    status: Number,
    wordList: []
}))
module.exports=modelName
