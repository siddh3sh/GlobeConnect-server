const express = require('express');
const _=require('lodash')
const router = express.Router();
const Map = require('collections/map')

const auth = require('../middleware/auth')
const {Post} = require('../models/postModel')
const {Comment} = require('../models/commentModel')


//get post and user
router.get('/:id', async (req, res)=>{
    try {
        const post = await Post.findOne({_id: req.params.id}).populate('user').populate('comments'); //edit later
        //var commentUserMap = new Map()
        var userArray = new Array()
        for(i=0; i< post.comments.length; i++)
        {
           
            userArray[i] = await Comment.findOne(post.comments[i]._id).populate('user')
            
            //commentUserMap.set(`${post.comments[i]}`, user )
        }

        //const commentUsers = commentUserMap()
        
        const discussionBody = {
            post: post,
            comment: userArray
        }
        res.send(JSON.stringify(discussionBody));
        
        //return res.send(post);
    } catch (error) {
        //console.log(error.message),
        res.status(400).send('bad request');
    }
    
});


//add post
router.post('/', async (req, res)=>{            //add later: ,auth - middleware
    // const {error} = validatePost(req.body);
    // if(err) return res.status(400).send(err.details[0].message);

    let post = new Post({
        user: req.body.user,
        content: req.body.content,
        likes: req.body.likes
    });

    post = await post.save();
    res.send(post);
});


// router.delete('/:id', async (req, res) => {
//     const post = await Post.findByIdAndRemove(req.params.id)

//     if(!post) return res.status(404).send('Post Not Found');

//     res.send('deleted');
// });


//update likes
router.put('/', async (req, res) => {
    //console.log(req.body)
   
    Post.findOneAndUpdate({_id: req.body._id}, { $inc: {likes: 1 } },{"new": true},function(err, doc) {
        if (err) {
        //console.log(err);
        res.status(500).send(err.message);
       } else {
        //console.log(doc);
        return res.status(200).send(doc);
       }})
      
});

// //get single post
// router.get('/:id', async (req, res) => {
//     const post = await Post.findById(req.params.id).populate('comments')
    
//     if(!post) return res.status(404).send('Post Not Found');

//     res.send(post);
// });

module.exports = router