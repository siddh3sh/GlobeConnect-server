const config = require('config')
const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
// const crypto = require('crypto');
// const multer = require('multer');
// const MulterGridfsStorage = require('multer-gridfs-storage');
// const GridFs = require('gridfs-stream');
// const methodOverride = require('method-override');



const userController = require('./controllers/userController')
const loginController = require('./controllers/loginController')
const postController = require('./controllers/postController')
const commentController = require('./controllers/commentController')
const discussionController = require('./controllers/discussionController')
const forumController = require('./controllers/forumController')
const adminController = require('./controllers/adminController')



const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(express.json());

app.use(express.static('uploads'));
app.use(express.urlencoded({extended: true}))

//check whether jwtkey is set or not
if(!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwtPrivateKey is not defined')
  process.exit(1)
}

//app.use(db)

//connect to mongoDB
const host = "localhost"
const port = "27017"
const database = "GlobeConnect"

const mongoConnString = `mongodb://${host}:${port}/${database}`;
console.log(mongoConnString)
mongoose.connect(mongoConnString, { useFindAndModify: false })
.then( ()=>{
  console.log('mongodb connected..')
})
.catch(()=>{
  console.log('Database Connection Failed')
})

  // //initialize stream
  // conn.once('open', () => {
  //   gfs = GridFs(conn.db, mongoose.mongo);
  //   gfs.collection('uploads')
   
  //   // all set!
  // })

  //create storage
  // const storage = new MulterGridfsStorage({
  //   url: mongoConnString,
  //   file: (req, file) => {
  //     return new Promise((resolve, reject) => {
  //       crypto.randomBytes(16, (err, buf) => {
  //         if (err) {
  //           return reject(err);
  //         }
  //         const filename = buf.toString('hex') + path.extname(file.originalname);
  //         const fileInfo = {
  //           filename: filename,
  //           bucketName: 'uploads'
  //         };
  //         resolve(fileInfo);
  //       });
  //     });
  //   }
  // });
  // const upload = multer({ storage });






// //upload.single('file_name_sam_as_given_in_forms_field_in_frontend')
// app.post('/set',upload.single('file'), (req, res) => {
//    res.json({file: req.file});
// });

//Setting Routes
app.use('/user',userController);
app.use('/auth', loginController);
app.use('/content', postController);
app.use('/content/comment', commentController);
app.use('/content/d', discussionController);
app.use('/forum', forumController);
app.use('/admin', adminController)

//Setting Port and Starting Server
app.listen(9669, () => {
    console.log(`Server started on port 9669...`);
});
