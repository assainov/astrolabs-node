const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const jwt = require('jsonwebtoken');

const routes = require('./routes/users.js');
const keys = require('./config/keys');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(passport.initialize());
// Passport Config
require('./config/passport')(passport);


app.use('/', routes);


const dbURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/node-class';

mongoose.connect(dbURL, {useNewUrlParser: true})
.then (() => {
    console.log('Connected to Database');
})
.catch((err) => {
    console.log('Connection unsuccessful');
    console.log(err);
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running at ' + port);
});





