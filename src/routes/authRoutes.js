const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, resp) => {

    const {email, password} = req.body;

    try {
        const user = new User({ email, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        resp.send({
            token
        });
    } catch (error) {
        return resp.status(422).send(error.message);
    }

});

router.post('/signin', async (req, resp) => {

    const {email, password} = req.body;

    if (!email || !password) {
        return resp.status(422).send({error: 'Must provide email and password'});
    }

    const user = await User.findOne({ email });

    if (!user) {
        return resp.status(422).send({ error: 'Email or password is incorrect' });
    }

    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        resp.send({ token });
    } catch (error) {
        return resp.status(422).send({error : 'Email or password is incorrect'});
    }

});

module.exports = router;