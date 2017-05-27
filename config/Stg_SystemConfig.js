"use strict"

const mysqlConnectOptions ={
    user: 'log',
    password: 'logbase',
    database:'log_base',
    host: '127.0.0.1' ,
    charset : 'utf8mb4',
    //,dateStrings : 'DATETIME'
};


const logLevel = 'DEBUG';
const loggerConfig = {
    appenders: [
        { type: 'console' },
        {
            "type": "file",
            "filename": "../logs/log_oauth.log",
            "maxLogSize": 2048000,
            "backups": 10
        }
    ]
}


const mongoConfig = {
    connect : 'mongodb://127.0.0.1:27017/log_records'
}

const redisConfig = {
    url : "redis://127.0.0.1:6379"
}

const tokenExpired = 2*60*60;
module.exports = { mysqlConnectOptions ,loggerConfig, logLevel , mongoConfig ,redisConfig ,tokenExpired}
