const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },
    content: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },

    likes: {
        type: Number,
        min: 0
    },

    creation_date: {
        type: Date,
        default: Date.now
    }

});


const Comment = mongoose.model('comment', commentSchema);

module.exports.commentSchema = commentSchema

module.exports.Comment = Comment