const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const {Post} = require('../models/postModel')
const {User} = require('../models/userModel')
const {Forum} = require('../models/forumModel')
const {Comment} = require('../models/commentModel')



//get post and user
router.get('/', async (req, res)=>{
    try {
        const posts = await Post.find().populate('user').populate('comments').populate('forum').sort({creation_date: -1}); //edit later
    // console.log(posts)
    //console.log('get all posts')
    return res.send(posts);
    } catch (error) {
        // console.log(error.message)
        return res.send(error.message);
    }
    
});


//add post
router.post('/', async (req, res)=>{            //add later: ,auth - middleware
    // const {error} = validatePost(req.body);
    // if(err) return res.status(400).send(err.details[0].message);

	let forumId = await Forum.findOne({name: req.body.forum}).select('_id');    
    
    let post = new Post({
        user: req.body.user,
        title: req.body.title,
        content: req.body.content,
        forum: forumId
    });

    try {
        post = await post.save().then(post => post.populate('user').execPopulate());
    
        await User.findOneAndUpdate({_id: post.user},  { $push: { posts: post._id}} );
        res.send(post);
    } catch (error) {
        res.status(400).send(error.message);
    }

    
});

//delete Post
router.delete('/:id', async (req, res) => {
    const post = await Post.findByIdAndRemove(req.params.id)

    await Comment.deleteMany({post: post._id})

    if(!post) return res.status(404).send('Post Not Found');

    res.send('deleted');
});


//update likes
router.put('/', async (req, res) => {
    //console.log(req.body)
   
    const post = await Post.findOneAndUpdate({_id: req.body._id}, { $inc: {likes: 1 } },{"new": true}).select('likes')
      res.status(200).send(post)
});

//get single post
router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id).populate('comments')
    
    if(!post) return res.status(404).send('Post Not Found');

    res.send(post);
});

//get Users post
router.get('/userpl/:id', async (req, res) => {
    const user = await User.findById(req.params.id).populate('posts').populate('forums')
    
    if(!user) return res.status(404).send('User Not Found');

    res.send(user);
});

//search Query
router.post('/search', async (req, res) => {

    try{
        const result  = await Post.find({title: { $regex: '.*' + req.body.query + '.*' }}).populate('user')
        //console.log(result)
    res.send(result)
    } catch (error){
        res.send(error.message)
    }
})

module.exports = router
