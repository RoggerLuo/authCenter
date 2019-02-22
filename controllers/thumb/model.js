const mongoose = require("mongoose")
const def = require("../../utils/default_val").def
const prototype = {
    userId:def.string,
    postId:def.string,
}
schema = new mongoose.Schema(prototype)
mongoose.model("thumb", schema)

module.exports = "thumb"