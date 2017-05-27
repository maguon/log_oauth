const sysConfig = require('../config/SystemConfig');
const log4js = require('log4js');

const createLogger = (name) => {
    log4js.configure(sysConfig.loggerConfig);
    const logger = log4js.getLogger(name);
    logger.setLevel(sysConfig.logLevel);
    return logger;
}

module.exports = {createLogger }