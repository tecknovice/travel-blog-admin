const debug = require('debug')('travel-blog-admin:userController')
const { body, param, validationResult } = require('express-validator');
const passport = require('passport');
const User = require('../models/User')

exports.login_get = [
    isAlreadyLoggedIn,
    async function (req, res, next) {
        res.render('user-login', { title: 'Login' })
    }
]

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

exports.create_get = [
    isAlreadyLoggedIn,
    async function (req, res, next) {
        res.render('user-register', { title: 'Register' })
    }
]

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

// Function to prevent user who already logged in from
// accessing login and register routes.
function isAlreadyLoggedIn(req, res, next) {
    if (req.user && req.isAuthenticated()) {
        res.redirect('/');
    } else {
        next();
    }
}

exports.update_get = async function (req, res, next) {
    res.render('user', { title: 'Update user'})
}

exports.update_profile_post = [
    body('name', 'Name is required').isLength({ min: 1 }),
    body('email', 'Email is invalid').isEmail(),
    body('avatar', 'Avatar must be image ObjectId').optional().isMongoId(),
    body('about', 'About is at least 500 characters').isLength({ min: 500 }),
    async function (req, res, next) {
        debug('update_post:req.body', req.body)
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.render('user', { title: 'Update user', warning_messages: result.errors.map(error => error.msg) })
            return
        }
        try {
            const user = new User({
                _id: req.user._id,
                name: req.body.name,
                email: req.body.email,
                avatar: req.body.avatar,
                about: req.body.about,
                socials: {
                    facebook: req.body.facebook,
                    instagram: req.body.instagram,
                    twitter: req.body.twitter,
                    youtube: req.body.youtube
                }
            })
            await User.findByIdAndUpdate(req.user._id, user)
            res.redirect('/user/update')
        } catch (error) {
            return next(error)
        }
    }]

exports.change_password_post = [
    body('new_password').custom(value => {
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
        if (!regex.test(value))
            throw new Error('New password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters')
        else return true
    }),
    async function(req,res,next){
        debug('update_post:req.body', req.body)
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.render('user', { title: 'Update user', warning_messages: result.errors.map(error => error.msg) })
            return
        }
        try {
            user = req.user
            const isValidate = user.validatePassword(req.body.current_password)
            if (!isValidate) {
                res.render('user', { title: 'Update user', warning_messages: ['Wrong current password'] })
                return
            }
            user.setPassword(req.body.new_password);
            await User.findByIdAndUpdate(req.user._id, user)
            res.redirect('/user/update')
        } catch (error) {
            return next(error)
        }
    }
]