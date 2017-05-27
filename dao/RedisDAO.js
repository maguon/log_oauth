/**
 * Created by xueling on 16/4/27.
 */
const redisCon = require('../db/connection/RedisCon.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('RedisDAO.js');
const redis = redisCon.redis;

const setStringVal = (params,callback) =>{
    try {
        redis.set(params.key, params.value);
        if (params.expired) {
            redis.expire(params.key, params.expired);
        }
        logger.debug('setStringVal');
        callback(null, {affectedRows: 1});
    } catch (e) {
        callback(e, null);
    }
}

const setAsyStringVal = (params)=>{
    if(params.expired && parseInt(params.expired)){
        redis.set(params.key,params.value,'EX',params.expired);
    }else{
        redis.set(params.key, params.value);
    }
    redis.get(params.key,function(error,result){
        if(error){
            logger.error(error.stack);
        }
    })
}

const getStringVal = (params, callback) =>{
    redis.get(params.key, function (error, result) {
        logger.debug('getStringVal');
        callback(error, result);
    });
}

const removeStringVal = (params,callback)=>{
    redis.del(params.key,function(error,result){
        logger.debug('removeStringVal');
        callback(error, result);
    })
}

const expireStringVal = (params) => {
    redis.expire(params.key, params.expired);
}

module.exports = {
    setStringVal,
    getStringVal ,
    setAsyStringVal ,
    removeStringVal ,
    expireStringVal
};