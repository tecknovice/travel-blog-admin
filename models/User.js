const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const debug = require('debug')('travel-blog-admin:User')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }
})


userSchema.methods.validatePassword = function(password){
    debug('password',password)
    debug('this',this)
    return bcryptjs.compareSync(password, this.password)
}

// Instance method for hashing user-typed password.
userSchema.methods.setPassword = async function (password) {
    this.password = await bcryptjs.hash(password, 8)
}
const User = mongoose.model('User', userSchema)

module.exports = User