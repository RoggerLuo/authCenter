const mongoose = require("mongoose")
const modelName = "post"
mongoose.model(modelName, new mongoose.Schema({
    content: String,
    modifyTime: Number,
    createTime: Number,
    username: String,
    starred: Boolean,
    status: Number
}))
module.exports=modelName
