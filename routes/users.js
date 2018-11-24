const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJwt = require('passport-jwt');

const User = require('../models/User.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('<h1>Hello Ilyas</h1>');
});


router.get('/user/:name', (req, res) => {
    res.send(`<h1>Welcome back, ${req.params.name}</h1>`);
});

router.post('/register', (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar
    });

    //  Save the user in DB
    newUser.save()
    .then((user) => { // after the user is saved
        res.json(user); //  send the user's details back
    })
    .catch((err) => {   // If save was not successful
        console.log('error is', err); // tell what happenned 
    });

});

router.post('/register-user', (req, res) => {
    User.findOne({ email: req.body.email })
    .then( user => {
        if (user) {
            return res.send({
                message: 'User already exists'
            });
        }
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        //  bcrypt generates a salt
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                newUser.password = hash;

                newUser.save()
                .then (user => res.send({user}))
                .catch (err => res.send(err));
            });
        });
    })
    .catch ( err => {console.log(err)});
});

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
    .then(user => {
        if (!user) {
            return res.send({
                message: 'No user with such an email'
            });
        }
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if (!isMatch) {
                return res.send({
                    message: 'Password is not correct'
                });
            }
            jwt.sign(
                {id: user._id, name: user.name},
                'secret',
                {expiresIn: 3600},
                (err, token) => {
                    res.send({
                        message: 'User is logged in',
                        token: 'Bearer ' + token,
                        name: user.name
                    });
                }
            );
        });
    })
    .catch(err => res.send(err));
});

router.get('/dashboard', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send({
        myFriends: [
            {name: 'Chingiz', location: 'Kz'},
            {name: 'Erke', location: 'Austria'},
            {name: 'Arslan', location: 'Canada'}
        ]
    });
});

router.get('*', (req, res) => {
    res.status(404).send('The page was not found.');
});


module.exports = router;