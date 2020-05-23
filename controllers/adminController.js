
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const express = require('express');
const router = express.Router();

const admin = require('../middleware/admin')
const auth = require('../middleware/auth')
const {User, validate} = require('../models/userModel')
const {Forum} = require('../models/forumModel')


//get users
router.get('/',[auth, admin], async (req, res)=>{
    const users = await User.find({isAdmin: false}).sort('name').select('-password');
    res.send(users);
});

//block user
router.put('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('User Not Found');

    //console.log(user)
    
    user.isBlocked = !user.isBlocked;
    user.save();
    res.send(user);
});


//delete user
router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)

    if(!user) return res.status(404).send('User Not Found');

    res.send('deleted');
});

//get single user
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('User Not Found');

    //console.log(user)
    
    user.isBlocked = !user.isBlocked;
    user.save();
    res.send(user);
});

//Add new Forum
router.post('/add-new-forum', async (req, res) => {
    let forum = new Forum({
        name: req.body.forum_name,
        description: req.body.description
    })

    try {
        forum = await forum.save();

    // console.log(forum)
    res.status(200).send(forum);
    } catch (error) {
        //console.log(error.message)
        res.status(400).send(error.message);
    }
    
});



module.exports = router;