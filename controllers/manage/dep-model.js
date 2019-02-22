const mongoose = require("mongoose")
const def = require("../../utils/default_val").def
const prototype = {
    // username: def.string,
    // name:def.string,

    title:def.string,
    content:def.string,
    createTime:def.number,
    images:[],
    subjectId:def.string,
    // {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "subject"
    // },
    
    authorId:def.string,
    readNumber:def.number,
    thumbNumber:def.number,
    replyNumber:def.number,
}
schema = new mongoose.Schema(prototype)
mongoose.model("post", schema)

