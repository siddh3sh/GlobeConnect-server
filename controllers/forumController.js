const express = require('express');
const router = express.Router();
const _ = require('lodash');
const fs = require('fs');
const mongoose = require('mongoose');
const formidable = require('formidable'); const util = require('util');
const auth = require('../middleware/auth');
const {Forum} = require('../models/forumModel');
const {User} = require('../models/userModel');
const {Post} = require('../models/postModel');

//get all forums
router.get('/', async (req, res)=>{
    const forums = await Forum.find().sort('name'); //edit later
    res.send(forums);
});


//add forum
router.post('/', async (req, res)=>{            //add later: ,auth - middleware
    // const {error} = validatePost(req.body);
    // if(err) return res.status(400).send(err.details[0].message);

    try{
        if(!fs.existsSync('./uploads/forumPics')) fs.mkdirSync('./uploads/forumPics');
        
        let form  = new formidable.IncomingForm({keepExtensions: true, uploadDir: "./uploads/forumPics"});
        form.parse(req, async (err, fields, files)=>{
            if(err) console.log(err);

            let forum = new Forum({
                name: fields.name,
                description: fields.description,
                display_pic: {
                    content: fs.readFileSync(files.display_pic.path),
                    contentType: files.display_pic.type
                }
            })
    
            forum = await forum.save();
            
            return res.send(forum);
        })
    }catch(error){
        return console.log(error.message);
    }

    
        
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
        
    } catch(error) {
        res.status(500).send(error.message);
    }
    
});


module.exports = router
