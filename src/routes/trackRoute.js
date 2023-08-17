const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = mongoose.model('Track');

const router = express.Router();

router.use(requireAuth);

router.get('/tracks', async (req, resp) => {

    const user = req.user;

    const tracks = await Track.find({userId: user._id});

    resp.send(tracks);

});

router.post('/tracks', async (req, resp) => {

    const {name, locations} = req.body;

    if (!name || !locations) {
        return resp.status(422).send({error: 'You must provide a name and location'});
    }

    try {
        const track = new Track({name, locations, userId: req.user._id});
        await track.save();
        resp.send(track);
    } catch (error) {
        return resp.status(422).send({ error: error.message });
    }



});

module.exports = router;