'use strict';

const mongoose = require('mongoose');
const def = require('../utils/default_val').def;
let accountSchema = null;

const createSchema = function() {

  const accountPrototype = {
    domainId: def.string,
    orgId: def.string,
    userId: def.string,
    username: def.string,
    nickname: def.string,
    name: def.string,
    avatar: def.string
  };

  accountSchema = new mongoose.Schema(accountPrototype);
};

const createIndex = function() {
  const usernameIndex = {
    username: 1,
    domainId: 1,
    orgId: 1
  };
  accountSchema.index(usernameIndex, {
    unique: true
  });
};

createSchema();
createIndex();

mongoose.model('Account', accountSchema);
