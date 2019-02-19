'use strict';

let isInit = false;
const mongoose = require('mongoose');
const config = require('../config');
const db = mongoose.connection;

const initMongoose = () => {
  db.on('open', () => {
    console.log('mongo连接打开');
  });
  db.on('connected', () => {
    console.log('mongo连接成功');
  });
  db.on('reconnected', () => {
    console.log('mongo重新连接成功');
  });
  db.on('disconnected', () => {
    console.error('mongo连接断开');
  });
  db.on('close', () => {
    console.error('mongo连接关闭');
  });
  db.on('error', err => {
    console.error(`mongo连接失败${err}`);
  });
  mongoose.connect(config.mongo.uri, config.mongo.opts);
};

const loadModel = function() { 
    //所有的model都是基于mogoose的默认连接，即mongoose.connection创建的，一个model对应一个connection
    require('../models')
}

const init = function() {
  if(!isInit){
    loadModel();
    initMongoose();
    isInit = true;
  }
};
init();

module.exports = {
  init,
  mongoose
};