const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
        index: {unique: true, sparse: true}
    },
    description: {
        type: String 
    }
    
});


const Forum = mongoose.model('forum', forumSchema);

module.exports.forumSchema = forumSchema

module.exports.Forum = Forum
