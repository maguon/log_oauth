"use strict"

const fs = require('fs');
const path = require('path');
const util = require('util');

const restify = require('restify');

const sysConfig = require('./config/SystemConfig');
const serverLogger = require('./util/ServerLogger');
const logger = serverLogger.createLogger('Server');
const token = require('./bl/Token.js');
const sms = require('./bl/Sms.js');
///--- API

/**
 * Returns a server with all routes defined on it
 */
function createServer() {



    // Create a server with our logger and custom formatter
    // Note that 'version' means all routes will default to
    // 1.0.0
    var server = restify.createServer({

        name: 'LOG-API',
        version: '0.0.1'
    });


    // Ensure we don't drop data on uploads
    //server.pre(restify.pre.pause());

    // Clean up sloppy paths like //todo//////1//
    server.pre(restify.pre.sanitizePath());

    // Handles annoying user agents (curl)
    server.pre(restify.pre.userAgentConnection());

    server.use(restify.plugins.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));



    restify.CORS.ALLOW_HEADERS.push('auth-token');
    restify.CORS.ALLOW_HEADERS.push('user-name');
    restify.CORS.ALLOW_HEADERS.push('user-type');
    restify.CORS.ALLOW_HEADERS.push('user-id');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Origin");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Credentials");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","GET");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","POST");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","PUT");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers","accept,api-version, content-length, content-md5,x-requested-with,content-type, date, request-id, response-time");
    server.use(restify.CORS());
    // Use the common stuff you probably want
    //hard code the upload folder for now
    server.use(restify.plugins.bodyParser({uploadDir:__dirname+'/../uploads/'}));
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.dateParser());
    server.use(restify.plugins.authorizationParser());
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.gzipResponse());

    // static files: /, /index.html, /images...
    //var STATIS_FILE_RE = /\/?\.css|\/?\.js|\/?\.png|\/?\.jpg|\/?\.gif|\/?\.jpeg|\/?\.less|\/?\.eot|\/?\.svg|\/?\.ttf|\/?\.otf|\/?\.woff|\/?\.pdf|\/?\.ico|\/?\.json|\/?\.wav|\/?\.mp3/;
    var STATIS_FILE_RE = /\.(css|js|jpe?g|png|gif|less|eot|svg|bmp|tiff|ttf|otf|woff|pdf|ico|json|wav|ogg|mp3?|xml|woff2|map)$/i;
    server.get(STATIS_FILE_RE, restify.serveStatic({ directory: './public/docs', default: 'index.html', maxAge: 0 }));
//    server.get(/^\/((.*)(\.)(.+))*$/, restify.serveStatic({ directory: './TruMenuWeb', default: "index.html" }));



    server.get(/\.html$/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));
    //For 'abc.html?name=zzz'
    server.get(/\.html\?/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));

    server.get('/api/token/:accessToken',token.queryToken);
    server.post({path:'/api/token',contentType: 'application/json'},token.saveToken);
    server.del({path:'/api/token/:accessToken',contentType: 'application/json'} ,token.removeToken);

    server.get('/api/:phone/passwordCode',sms.getRestPswd);
    server.post({path:'/api/:phone/passwordCode',contentType: 'application/json'},sms.addRestPswd);



    server.on('NotFound', function (req, res, next) {
        logger.warn(req.url + " not found");
        res.send(404,{success:false,msg:" service not found !"});
        next();
    });
    return (server);

}



///--- Exports

module.exports = {
    createServer: createServer
};