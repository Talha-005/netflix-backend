const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { Genre, validate } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Getting genre
router.get('/', async (req, res) => {

    const genres = await Genre.find().sort('name');
    res.send(genres);
})



// Getting a single genre 
router.get('/:genre', validateObjectId, (async (req, res) => {

    // const genre = await Genre.findOne({ name: req.params.genre });

    const genre = await Genre.findById(req.params.genre);
    if (!genre) return res.status(404).send(`The given genre ${req.params.genre} not found..!`);
    res.send(genre);
}));

// Creating a genre
router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    let genre = await Genre.findOne({ name: req.body.name });
    if (genre) return res.status(400).send(`Genre "${req.body.name}" already registered`)

    genre = new Genre({
        name: req.body.name
    });
    await genre.save();
    res.send(genre);
})

// updating a genre
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, { new: true });

    if (!genre) return res.status(404).send(`The genre with given ID not Found`);
    res.send(genre);
})

//delete a genre
router.delete('/:id', [auth, admin], async (req, res) => {

    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send('Genre ID ' + req.params.id + ' not found');
    res.send(genre);
})

module.exports = router;