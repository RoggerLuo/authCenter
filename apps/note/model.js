const mongoose = require("mongoose")
const modelName = "post"
mongoose.model(modelName, new mongoose.Schema({
    content: String,
    createTime: Number,
    username: String,
    modifyTime: Number,
    starred: Boolean,
    status: Number
}))
module.exports=modelName
