"use strict";

const mongoose = require("mongoose");
const def = require("../utils/default_val").def;
let appSchema = null;

const createSchema = function() {
  const appPrototype = {
    name: def.string,
    description: def.string,
    key: def.string,
    modifyDate: def.date,
    createDate: def.date,
    ownerId: def.string,
    owner: def.string,
    categoryId:def.string

    // {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Account"
    // },
  };

  appSchema = new mongoose.Schema(appPrototype);
};

const createIndex = function() {
};

createSchema();
createIndex();

mongoose.model("App", appSchema);
