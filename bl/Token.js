"use strict"

const sysMsg = require('../util/SystemMsg');
const sysError = require('../util/SystemError');
const resUtil = require('../util/ResponseUtil');
const redisDAO = require('../dao/RedisDAO.js');
const listOfValue = require('../util/ListOfValue.js');
const serverLogger = require('../util/ServerLogger.js');
const systemConfig = require('../config/SystemConfig.js');
const logger = serverLogger.createLogger('Token.js');
const Promise = require('Promise');

const removeToken = (req,res,next)=>{
    let params = req.params;
    const tokenKey = listOfValue.USER_HEADER + params.accessToken;
    redisDAO.removeStringVal({key:tokenKey},(error,result)=>{
        if (error) {
            logger.error(' removeToken ' + error.stack);
            return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG));
        } else {
            logger.info(' removeToken ' + 'success');
            var resObj ={};
            resObj.affectedRows = 1;
            resUtil.resetUpdateRes(res,resObj,null);
            return next();
        }
    })
};

const queryToken = (req,res,next)=>{
    let params = req.params;
    const token = listOfValue.USER_HEADER + params.accessToken;
    let userInfo = {};
    redisDAO.getStringVal({key:token},(error,result)=>{
        if(error){
            logger.error(' queryToken ' + error.stack);
            return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG));
        }else{
            if(result){
                try{
                    userInfo = eval("(" + result + ")");
                    redisDAO.expireStringVal({key:token,expired:systemConfig.tokenExpired});
                    logger.info(' queryToken ' + 'success');
                    resUtil.resetQueryRes(res,userInfo,null);
                    return next();
                }catch(e){
                    userInfo = null;
                    logger.error(' queryToken ' + error.stack);
                    return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG));
                }
            }else{
                logger.warn(' queryToken ' + ' failed ');
                let error=  sysError.NotAuthorizedError();
                return next(error)
            }
        }
    })

}

const saveToken = (req,res,next)=>{
    let params = req.params;
    const userObj = {
        id:params.userId,
        type:params.type,
        name:params.name,
        phone:params.phone,
        status:params.userStatus
    }
    const userStr = JSON.stringify(userObj);
    const tokenKey = listOfValue.USER_HEADER + params.accessToken;
    const subParams = {
        key : tokenKey,
        value : userStr,
        expired : systemConfig.tokenExpired
    }
    redisDAO.setStringVal(subParams,(error,result)=>{
        if(error){
            logger.error(' queryToken ' + error.stack);
            return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG));
        }else{
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}

module.exports = { removeToken , queryToken ,saveToken};