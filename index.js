const config = require('config')
const express = require('express');
const mongoose = require('mongoose');
const db = require('./db/db');
// const path = require('path');
// const crypto = require('crypto');
// const multer = require('multer');
// const MulterGridfsStorage = require('multer-gridfs-storage');
// const GridFs = require('gridfs-stream');
// const methodOverride = require('method-override');


//Import Controllers
const userController = require('./controllers/userController')
const loginController = require('./controllers/loginController')
const postController = require('./controllers/postController')
const commentController = require('./controllers/commentController')
const discussionController = require('./controllers/discussionController')
const forumController = require('./controllers/forumController')
const adminController = require('./controllers/adminController')



const app = express();

//Allow Cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//Parse JSON
app.use(express.json());


app.use(express.static('uploads'));
app.use(express.urlencoded({extended: true}))

//check whether jwtkey is set or not
if(!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwtPrivateKey is not defined')
  process.exit(1)
}

//app.use(db)

//fetch db details and connect to mongoDB
const {username, password, database} = db;

//const mongoConnString = `mongodb://${host}:${port}/${database}`;

const mongoConnString = `mongodb+srv://${username}:${password}@cluster0-2l6ic.mongodb.net/${database}?retryWrites=true&w=majority`

console.log(mongoConnString)
mongoose.connect(mongoConnString, { useFindAndModify: false })
.then( ()=>{
  console.log('mongodb connected..')
})
.catch(()=>{
  console.log('Database Connection Failed')
})

  
  
//Setting Routes
app.use('/user',userController);
app.use('/auth', loginController);
app.use('/content', postController);
app.use('/content/comment', commentController);
app.use('/content/d', discussionController);
app.use('/forum', forumController);
app.use('/admin', adminController)

//Setting Port and Starting Server
const port = process.env.PORT || 9669;
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});
