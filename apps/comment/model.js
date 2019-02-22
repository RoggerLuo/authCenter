const mongoose = require("mongoose")
const prototype = {
    // 来自前端的值
    postId:String,
    commentId:String, //所属的评论id
    replyUserId: String, //被回复者的评论id
    content: String,
    // 需要自己查库的
    subjectId: String, 
    authorId: String,
    createTime: Number,
    //option
    replyNumber: Number,
    thumbCount: Number
}
schema = new mongoose.Schema(prototype)
mongoose.model("comment", schema)
module.exports = "comment"