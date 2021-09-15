const { Customer, validate } = require('../models/customer');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const customer = await Customer.find().sort('name');
    res.send(customer);
})

router.get('/:name', async (req, res) => {

    try {
        const customer = await Customer.find({ name: req.params.name });
        res.send(customer);
    }
    catch (err) { res.status(400).send(err.message) }
});

router.post('/',auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    await customer.save();
    res.send(customer);
})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, { new: true });

    if (!customer) return res.status(404).send(`The Customer with given ID not Found`);
    res.send(customer);
})

router.delete('/:id',[auth,admin], async (req, res) => {

    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send('Customer ID ' + req.params.parm + ' not found');
    res.send(customer);
})

module.exports = router;