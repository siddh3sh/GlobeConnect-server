const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    forum: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'forum',
        
    },
    
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100

    },

    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1000
    },

    likes: {
        type: Number,
        min: 0,
        default:0
        
    },

    creation_date: {
        type: Date,
        default: Date.now
    },

    comments:[{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}]
});




const Post = mongoose.model('post', postSchema);

module.exports.postSchema = postSchema

module.exports.Post = Post