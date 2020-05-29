
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const express = require('express');
const multer = require('multer'); 
const router = express.Router();

const admin = require('../middleware/admin')
const auth = require('../middleware/auth')
const {User, validate} = require('../models/userModel')


//get users
router.get('/',[auth, admin], async (req, res)=>{
    const users = await User.find().sort('name').select('-password');
    res.send(users);
});

//get Single User
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id}).populate('forums').select('name username forums')
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
    
})


//add user
router.post('/', async (req, res)=>{
     const {error} = validate(req.body);
     if(error) return res.status(400).send(error.details[0].message);
 	try{
     let user =  await User.findOne({email: req.body.email});   //check if already exist
     if(user) return res.status(400).send('User Already Registered');

    
     /*before lodash
     user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });*/

    //after lodash
    user = new User(_.pick(req.body, ['name', 'username', 'email','bio', 'password']));
    const salt = await bcrypt.genSalt(9);
    user.password = await bcrypt.hash(user.password, salt)

    user = await user.save();

    const token = user.generateAuthToken()
    const body = {authtoken: token}
    res.send(body);
	}catch(error){
		console.log(error.message);
	}
});


//update user
// router.put('/:id', async (req, res) => {
//     const user = await User.findByIdAndUpdate(req.params.id,
//         {
//             name: req.body.name,
//             username: req.body.username,
//             email: req.body.email,
//             password: req.body.password
//         }, {new: true});
//     if(!user) return res.status(404).send('User Not Found');
//     res.send(user);
// });


//delete user
router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)

    await Post.deleteMany({user: user._id})

    if(!user) return res.status(404).send('User Not Found');

    res.send('deleted');
});

//follow forum
router.put('/follow-forum', async (req, res) => {
    try{
        let user = await User.findById(req.body.user);
        let followed = false;
        user.forums.forEach((item, index)=>{
            if(item == req.body.forum){
                followed = true;
            }

        });

        if(followed) return res.send('following');
        
        else{
            user = await User.findByIdAndUpdate(req.body.user,  { $push: {forums: req.body.forum} }, {new: true}).populate('forums').select('name forums');
            
            //if(!user) return res.status(404).send('User Not Found');
            res.send(user);
	}
    }
    catch(error){
        //console.log(error.message)
        console.log(error.message);
    }
});


//upload image
const MIME_TYPE_MAP ={
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
    
}

const storage = multer.diskStorage({
    
    //exeuted when multer try to save a file
    //setting destination
    destination: (req, file, callback)=>{
        callback(null, "uploads/") //folder relative to index.js
    },

    //setting file name
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        //const ext = MIME_TYPE_MAP[file.mimetype];  
        callback(null, name); // + '-'+ Date.now() + '.' + ext
    }
}) //to configure how multer store files by setting keys viz. functions

const upload = multer({storage: storage})

router.post('/pp',upload.single('profilepic'), async (req, res) => {
    //console.log('inside pp')
   // const url = req.protocol + '://' + req.get('host');
    // imagePath: url + "/uploads/" + 

    //console.log(req.file.filename)
    const user = await User.findOneAndUpdate({_id: req.body.id},{profilePic: req.file.filename},{'new': true});
    
    if(!user) return res.status(404).send('User Not Found');
    
    res.status(200).send({
        message: "Post Added Succesccfully",
        post: {
            id: user._id,
            name: user.name,
            profilePic: user.profilePic
        }
    });
});

module.exports = router;
