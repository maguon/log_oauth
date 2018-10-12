'use strict'
const sysMsg = require('../util/SystemMsg');
const sysError = require('../util/SystemError');
const resUtil = require('../util/ResponseUtil');
const redisDAO = require('../dao/RedisDAO.js');
const listOfValue = require('../util/ListOfValue.js');
const serverLogger = require('../util/ServerLogger.js');
const systemConfig = require('../config/SystemConfig.js');
const logger = serverLogger.createLogger('Sms.js');
const Promise = require('Promise');

const addRestPswd = (req,res,next)=>{
    let params = req.params;
    let subParams = {};
    subParams.expired = listOfValue.EXPIRED_TIME_PSWD_SMS;
    subParams.key = listOfValue.CACHE_APPEND_PSWD + params.phone;
    subParams.value = params.code;
    redisDAO.setStringVal(subParams,(error,result)=>{
        if(error){
            logger.error(' addRestPswd ' + error.stack);
            return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG));
        }else{
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};

const addSignCode = (req,res,next)=>{
    let params = req.params;
    let subParams = {};
    subParams.expired = listOfValue.EXPIRED_TIME_PSWD_SMS;
    subParams.key = listOfValue.CACHE_APPEND_SIGN + params.phone;
    subParams.value = params.code;
    redisDAO.setStringVal(subParams,(error,result)=>{
        if(error){
            logger.error(' addSignCode ' + error.stack);
            return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG));
        }else{
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};

const getRestPswd = (req,res,next)=>{
    let params = req.params;
    const key = listOfValue.CACHE_APPEND_PSWD + params.phone;
    redisDAO.getStringVal({key:key},(error,result)=>{
        if(error){
            logger.error(' getRestPswd ' + error.stack);
            return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG));
        }else{
            if(result){
                let codeObj = {code : result}
                logger.info(' getRestPswd ' + 'success');
                resUtil.resetQueryRes(res,codeObj,null);
                return next();
            }else{
                logger.warn(' getRestPswd ' + ' failed ');
                resUtil.resetQueryRes(res,{},null);
                return next();
            }
        }
    })
}

const getSignCode = (req,res,next)=>{
    let params = req.params;
    const key = listOfValue.CACHE_APPEND_SIGN + params.phone;
    redisDAO.getStringVal({key:key},(error,result)=>{
        if(error){
            logger.error(' getSignCode ' + error.stack);
            return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG));
        }else{
            if(result){
                let codeObj = {code : result}
                logger.info(' getSignCode ' + 'success');
                resUtil.resetQueryRes(res,codeObj,null);
                return next();
            }else{
                logger.warn(' getSignCode ' + ' failed ');
                resUtil.resetQueryRes(res,{},null);
                return next();
            }
        }
    })
}
module.exports = {
    addRestPswd , addSignCode, getRestPswd ,getSignCode
}