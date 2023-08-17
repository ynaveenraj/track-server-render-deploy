require('./models/User');
require('./models/Track');

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoute');
const bodyParser = require('body-parser');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri = 'mongodb+srv://admin:passwordpassword@cluster0.vkp870i.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('connected to mongo instance');
});

mongoose.connection.on('error', (err) => {
    console.error('error in connecting to mongo instance ', err);
});

app.get('/', requireAuth, (req, resp) => {
    resp.send(`Your email: ${req.user.email}`);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});