const debug = require('debug')('travel-blog-admin:userController')
const { body, param, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/User')

exports.login_get = async function (req, res, next) {
    res.render('user-login', { title: 'Login' })
}

exports.login_post = [
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: false
    })
]

exports.logout_get = [
    function (req, res, next) {
        req.logout();
        req.session.destroy(err => {
            res.redirect('/user/login');
        });
    }
]

exports.create_get = async function (req, res, next) {
    res.render('user-register', { title: 'Register' })
}
exports.create_post = [
    body('name').isLength({ min: 1 }).withMessage('name is required'),
    body('email').isEmail().withMessage('email is not valid'),
    body('password').custom(value => {
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
        if (!regex.test(value))
            throw new Error('password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters')
        else return true
    }),
    async function (req, res, next) {
        const result = validationResult(req);
        const user = new User({
            name: req.body.name,
            email: req.body.email
        })
        if (!result.isEmpty()) {
            res.render('user-register', { title: 'Register', user, warning_messages: result.errors.map(error => error.msg) })
            return
        }
        try {
            const foundUser = await User.findOne({ email: req.body.email })
            debug('create_post:foundUser', foundUser)
            if (foundUser) {
                res.render('user-register', { title: 'Register', user, warning_messages: ['Email has already taken'] })
            } else {
                await user.setPassword(req.body.password)
                await user.save()
                res.redirect('/user/login')
            }
        } catch (error) {
            res.render('user-register', { title: 'error', user, warning_messages: [error.toString()] })
        }
    }
]