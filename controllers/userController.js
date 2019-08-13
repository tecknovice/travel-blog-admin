const User = require('../models/User')

exports.login_get = async function(req,res,next){
    res.render('user-login')
}
exports.login_post = async function(req,res,next){
    res.send('NOT IMPLEMENTED: user login POST')
}

exports.create_get = async function(req,res,next){
    res.render('user-register')
}
exports.create_post = async function(req,res,next){
    res.send('NOT IMPLEMENTED: user login POST')
}