/**
 * Created by lingxue on 2016/12/8.
 */
const serverLogger = require('./ServerLogger.js');
const logger = serverLogger.createLogger('BaseUtil.js');
const Json2String = (obj)=>{
    try{
        return JSON.stringify(obj);
    }catch(e){
        logger.error('Json2String error:' +obj);
        return null;
    }
}

const String2Json = (string) => {
    try{
        return JSON.parse(string);
    }catch(e){
        logger.error('String2Json error:' +string);
        return null;
    }
}

module.exports = {Json2String ,String2Json}