
const bcrypt = require('bcryptjs')

const _ = require('lodash')
const express = require('express');
const Joi = require('joi')
const router = express.Router();


const {User} = require('../models/userModel')



//Authenticate User
router.post('/', async (req, res)=>{
     const {error} = validateLogin(req.body);
     if(error) return res.status(400).send("Invalid Email or Password");
 
     let user =  await User.findOne({email: req.body.email});
     if(!user) return res.status(400).send('Invalid Email or Password');
     if(user.isBlocked == true) return res.status(400).send('Your Account is suspended');

     const isValid = bcrypt.compare(req.body.password, user.password)
     if (!isValid) return res.status(400).send('Invalid Email or Password');

    //generate json web token

    const token = user.generateAuthToken()
    const resBody = {authtoken: `${token}`}
    res.send(resBody);

});



function validateLogin(user)
{
    const schema = {
        
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    }

    return Joi.validate(user, schema)

}

module.exports = router;