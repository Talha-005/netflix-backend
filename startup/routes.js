const express = require('express');
const home = require('../routes/home');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const returns = require('../routes/returns');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');



module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/mts', home);
    app.use('/mts/genres', genres);
    app.use('/mts/customers', customers);
    app.use('/mts/movies', movies);
    app.use('/mts/rentals', rentals);
    app.use('/mts/users', users);
    app.use('/mts/auth', auth);
    app.use('/mts/returns', returns);
    app.use(error);
}