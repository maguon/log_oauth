'use strict'
const getopt = require('posix-getopt');
const restify = require('restify');

const searchServer = require('./server');
const sysConfig = require('./config/SystemConfig')
const serverLogger = require('./util/ServerLogger');
const logger = serverLogger.createLogger('main');


///--- Globals

const NAME = 'log_search';

// In true UNIX fashion, debug messages go to stderr, and audit records go

 const parseOptions = () => {
    let option = {};
    let opts = {}
    let parser = new getopt.BasicParser(':h:p:(port)', process.argv);

    while ((option = parser.getopt()) !== undefined) {
        switch (option.option) {
            case 'p':
                opts.port = parseInt(option.optarg, 10);
                break;
            case 'h':
                usage();
                break;

            default:
                usage('invalid option: ' + option.option);
                break;
        }
    }

    return (opts);
}


const usage = (msg) => {
    if (msg)
        console.error(msg);

    var str = 'usage: ' +
        NAME +
        '[-p port] [-h]';
    console.error(str);
    process.exit(msg ? 1 : 0);
}


(() =>{
    let opt=parseOptions();
    const server = searchServer.createServer();

    server.listen((opt.port?opt.port:9009), () => {
        server.get('/',restify.serveStatic({
            directory: './public/docs',
            default: 'index.html',
            maxAge: 0
        }));
        logger.info('LOG-OAUTH server has been  started ,listening at %s', server.url);
    });
})();