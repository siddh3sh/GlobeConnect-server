const mongoose = require('mongoose');
const Joi = require('joi')
const config = require('config')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength:255
    },

    profilePic: {
        type: String
    },

    bio: {
        type: String
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    isBlocked: {
        type: Boolean,
        default: false
    },

    reg_date: {
        type: Date,
        default: Date.now
    },
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: "post"}],

    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}],
    
    forums: [{type: mongoose.Schema.Types.ObjectId, ref: "forum"}]

});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'), {expiresIn: 31557600})
    return token;
}


const User = mongoose.model('user', userSchema);


function validateUser(user){
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        username: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
        bio: Joi.string()
    }

    return Joi.validate(user, schema)
}

module.exports.userSchema = userSchema

module.exports.User = User

module.exports.validate = validateUser
