const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const auth = require('../middleware/auth')
const {Forum} = require('../models/forumModel')
const {User} = require('../models/userModel')
const {Post} = require('../models/postModel')

//get all forums
router.get('/', async (req, res)=>{
    const forums = await Forum.find().sort('name'); //edit later
    res.send(forums);
});


//add forum
router.post('/', async (req, res)=>{            //add later: ,auth - middleware
    // const {error} = validatePost(req.body);
    // if(err) return res.status(400).send(err.details[0].message);

    let forum = new Forum({
        name: req.body.name,
	description: req.body.description
    });

    forum = await forum.save();
    res.send(forum);
});

//delete Forum
router.delete('/:id', async (req, res) => {
    const forum = await Forum.findByIdAndRemove(req.params.id)

    if(!forum) return res.status(404).send('Forum Not Found');

    res.send('deleted');
});


//update foum
router.put('/', async (req, res) => {
    //console.log(req.body)
   
    Forum.findOneAndUpdate({_id: req.body._id}, { $inc: {likes: 1 } },{"new": true},function(err, doc) {
        if (err) {
        //console.log(err);
        res.status(500).send(err.message);
       } else {
        //console.log(doc);
        return res.status(200).send(doc);
       }})
      
});

//get single forum
router.get('/:id', async (req, res) => {

    try {
        const forum = await Forum.findById(req.params.id);
        if(!forum) return res.status(404).send('Forum Not Found');

        const forumPosts = await Post.find({forum: req.params.id}).populate('user', '_id username profilePic');

        const forumUsers = await User.find({forums: mongoose.Types.ObjectId(`${req.params.id}`)}).select('_id username profilePic')

        const body = {
            forum: forum,
            forumUsers: forumUsers,
            forumPosts: forumPosts
        }

        res.send(body);
        
    } catch (error) {
        res.status(500).send(error.message);
    }
    
});


module.exports = router
