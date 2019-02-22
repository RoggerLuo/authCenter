const mongoose = require("mongoose")
const def = require("../../utils/default_val").def
const prototype = {
    title:def.string,
    content:def.string,
    createTime:def.number,
    images:[],
    subjectId:def.string,
    recommendStatus: Boolean,
    topStatus: Boolean,
    // {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "subject"
    // },
    authorId:def.string,
    readNumber:def.number,
    thumbNumber:def.number,
    replyNumber:def.number,
}
const modelName = "post"
mongoose.model(modelName, new mongoose.Schema(prototype))
module.exports=modelName