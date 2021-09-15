const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {

    // mongoose.set('useNewUrlParser', true);
    // mongoose.set('useFindAndModify', false);
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useUnifiedTopology', true);

    const db = config.get('db');
    mongoose.connect(db,{
        useNewUrlParser:true,
        useFindAndModify:false,
        useCreateIndex:true,
        useUnifiedTopology:true
    })
        .then(() => winston.info(`Connected to ${db}`));
}