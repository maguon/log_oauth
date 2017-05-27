"use strict"

const Redis = require('ioredis');
const sysConfig = require('../../config/SystemConfig.js');
const redis = new Redis(sysConfig.redisConfig.url);

module.exports = {
    redis
};