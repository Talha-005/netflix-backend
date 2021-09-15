const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function () {

    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtException.log' })
    );

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    winston.add(winston.transports.File,{ filename: 'logfile.log' });
    // winston.add(winston.transports.MongoDB,{ 
    //     db: 'mongodb+srv://dbUser:12345@cluster0.vf2e0.mongodb.net/mtsApp?retryWrites=true&w=majority',level:'info' 
    // });
}