"use strict"
const mongoose = require('mongoose');
const serverLogger = require('../../util/ServerLogger');
const sysConfig = require('../../config/SystemConfig');
const logger = serverLogger.createLogger('MongoCon');



try{
    mongoose.connect(sysConfig.mongoConfig.connect);
    logger.info('Connect Mongodb Success');
}catch(err){
    logger.error('Connect mongodb error :' +err.stack)
}

const getMongo = ()=>{
    return mongoose ;
}

module.exports = {
    getMongo
};

