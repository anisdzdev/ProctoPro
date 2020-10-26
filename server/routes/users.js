const auth = require('../middleware/auth');
const dna_1 = require('../middleware/dna_register_1');
const dna_2 = require('../middleware/dna_register_2');
const dna_3 = require('../middleware/dna_register_3');
const dna_delete = require('../middleware/dna_delete');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user_model');
const Joi = require('joi');
const express = require('express');
const multer = require("multer");

const router = express.Router();

const getFields = multer();

router.post('/me/', [auth, getFields.any()], async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.get('/check/:email', [getFields.any()], async (req, res) => {
    const user = await User.findOne({email: req.params.email});
    if (user) {
        return res.json({user: user});
    } else {
        return res.json({user: 0});
    }
});

router.post('/auth/', getFields.any(), async (req, res) => {
    const {error} = validate_auth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).json({error: {form: 'Invalid Credentials'}});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({error: {form: 'Invalid Credentials'}});

    const token = user.generateAuthToken();
    res.send(token);
});

router.post('/initiate/', [auth, getFields.any(), dna_1, dna_2, dna_3], async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {initiated: true}, {new: true}).select('-password');
    if (!user) return res.status(404).send('The user with the given ID was not found.');
    const token = user.generateAuthToken();
    res.send(token);
});

router.delete('/delete_pattern/', [auth, getFields.any(), dna_delete], async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {initiated: false}, {new: true}).select('-password');
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

router.post('/new/', getFields.any(), async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

function validate_auth(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(req);
}


module.exports = router;