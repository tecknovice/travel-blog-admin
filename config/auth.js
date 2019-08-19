// Authentication Packages
const express = require('express');
const router = express.Router();
const ExpressSession = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const MongoStore = require('connect-mongo')(ExpressSession);

const session = ExpressSession({
    secret: 'session-secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: process.env.MONGODB_URL,
        ttl: 24 * 60 * 60 // 1 day
    })
    // cookie: { secure: true }
})

// Configure the local strategy for use by Passport.
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, callback) {
            User.findOne({ email }, function (err, user) {
                if (err) {
                    return callback(err);
                }
                if (!user) {
                    return callback(null, false, { message: 'Incorrect email. ' });
                }
                if (!user.validatePassword(password)) {
                    return callback(null, false, { message: 'Incorrect password.' });
                }
                return callback(null, user);
            });
        }
    )
)

// Configure Passport authenticated session persistence.
passport.serializeUser(function (user, callback) {
    callback(null, user._id);
});

passport.deserializeUser(function (id, callback) {
    User.findById(id, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
});

const authRouter = router.use(/^(?!.*(\/user\/login))/, function (req, res, next) {
    if (req.isAuthenticated()) {
        // Authenticated. Proceed to next function in the middleware chain.
        return next();
    } else {
        res.redirect('/user/login');
    }
})

module.exports = { session, passport, authRouter }