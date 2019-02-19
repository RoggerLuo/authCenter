"use strict";

const mongoose = require("mongoose");
const def = require("../utils/default_val").def;
let bugSchema = null;

const createSchema = function() {
  const bugPrototype = {
    userId: def.string,
    createDate: def.date,
    fileId: def.string,
    appId: def.string,
  };

  bugSchema = new mongoose.Schema(bugPrototype);
};

const createIndex = function() {
};

createSchema();
createIndex();

mongoose.model("Shortcuts", bugSchema);
