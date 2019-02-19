
const mongoose = require("mongoose");
const def = require("../utils/default_val").def;
let fileSchema = null;

const createSchema = function() {
  const filePrototype = {
    createDate: def.date,

    father: def.string,
    appId:def.string,

    ownerId:def.string,
    ownerName: def.string,

    fileName: def.string,
    fileType: def.string,
    fileSize: def.string,
    
    mediaId: def.string,

    link:def.string,
    // {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "App"
    // },
  };

  fileSchema = new mongoose.Schema(filePrototype);
};

const createIndex = function() {
};

createSchema();
createIndex();

mongoose.model("fileRepo", fileSchema);
