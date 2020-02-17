const express = require('express');
const router = express.Router();
const _ = require('lodash')

const auth = require('../middleware/auth')
const {Comment} = require('../models/commentModel')
const {Post} = require('../models/postModel')
const {User} = require('../models/userModel')


//get post and user
// router.get('/', async (req, res)=>{
//     const comments = await Comment.find().populate('user').sort('creation_date');
//     res.send(posts);
// });


//add comment
router.post('/', async (req, res)=>{            //add later: ,auth - middleware
    // const {error} = validatePost(req.body);
    // if(err) return res.status(400).send(err.details[0].message);

    try {
        let comment = new Comment({
            user: req.body.user,
            post: req.body.post,
            content: req.body.content
        });
    
        comment = await comment.save();

        comment = await Comment.populate(comment, {path: 'user'});
        
        await Post.findOneAndUpdate({_id: comment.post},{ "$push": {comments: comment._id}},{'new': true});

        await User.findOneAndUpdate({_id: comment.user},{ "$push": {comments: comment._id}},{'new': true});
        
        res.send(comment);

    } catch (error) {
        //console.log(error.message);
        res.status(500).send(error.message)
    }

    
    //res.send(comment);
});


router.delete('/:id', async (req, res) => {
    const post = await Comment.findByIdAndRemove(req.params.id)

    if(!post) return res.status(404).send('Comment Not Found');

    res.send('deleted');
});

// router.put('/:id', async (req, res) => {
//     const user = await User.findByIdAndUpdate(req.params.id,
//         {
//             name: req.body.name,
//             username: req.body.username,
//             email: req.body.email,
//             password: req.body.password
//         }, {new: true});
//     if(!user) return res.status(404).send('User Not Found');
      
// });

//update likes
router.put('/', async (req, res) => {
    //console.log(req.body)
    // const post = await Comment.findOneAndUpdate({ _id: req.body._id }, 
    //                                          { $set: {$inc: { likes: 1 } }}, 
    //                                         {new: true},(err, post)=>{
    //                                             if(err) return res.status(404).send('post Not Found');
                                                
    //                                         } );
    var post = Comment.findOne({_id: req.body._id})

    Comment.findOneAndUpdate(post, { $inc: {'post.likes': 1 } }, {new: true },function(err, response) {
        if (err) {
        //console.log(err);
       } else {
        //console.log(response);
       }})

    //create query conditions and update variables
// var conditions = {_id: req.body._id },
//     update = { $set:{ $inc: { likes: 1 }}};

// //    update documents matching condition
//     await Comment.update(conditions, update).exec();
//     const post = await Comment.findById({_id: req.body._id})
//      console.log(post)
    
    
      
});

//get single post
router.get('/:id', async (req, res) => {
    const post = await Comment.findById(req.params.id)
    
    if(!post) return res.status(404).send('Comment Not Found');

    res.send(post);
});

module.exports = router