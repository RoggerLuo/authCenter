'use strict';

const StatusCode = require('./status_code');

const formatResData = function(code, additionalData) {
  return {
    status: code,
    msg: StatusCode[code] || 'unknow ecode',
    results: additionalData
  };
};

const getResFn = function(res) {
  const success = function(data) {
    const returnedData = formatResData('ok', data);
    res.json(returnedData);
    return data;
  };
  const fail = function(e) {
    console.log('******** getResFn error ******** ')
    console.log(e)
    let error = e;
    if (!(error instanceof Error)) {
      console.error('需要更新遗留代码的错误抛出方式啦', e);
      error = new Error('e_server');
    }
    const returnedData = {
        errorCode: error.name,
        message: error.message,
        status: 'error'
    }
    
    //formatResData(error.message, error.additionalData);
    res.json(returnedData);
    console.error(e, e.stack);
    return error;
  };
  return {
    success: success,
    fail: fail
  };
};

const getErrorFn = function(res, resFunc) {
  return function(e) {
    console.error('服务器错误', e, e.stack);
    const client = resFunc || getResFn(res);
    client.fail(e);
  };
};

module.exports = {
  getResFn,
  getErrorFn,
};