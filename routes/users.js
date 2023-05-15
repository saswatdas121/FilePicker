const express = require('express');
const multer=require('multer');
const db=require('../data/database');

const storageConfig=multer.diskStorage({
  destination:function(req,file,cb)
  {
      cb(null,'images');
  },
  filename:function(req,file,cb)
  {
     cb(null,Date.now()+'-'+file.originalname);
  }
});//To have control over file path and file name

const upload=multer({storage:storageConfig});//The uploaded files will be stored in the hard disk instead of databases.Only the path of the image will be stored in the databases.So
//we will tell where the images will be stored
const router = express.Router();

router.get('/',  async function(req, res) {
  const userData=await db.getDb().collection('users').find().toArray();
  res.render('profiles',{userData:userData});
});

router.post('/profiles',upload.single('image'),async function(req,res)
{
  const fileImage=req.file;
  const userData=req.body;

 await db.getDb().collection('users').insertOne({
    name:userData.username,
    image:fileImage.path
  });

  res.redirect('/')

});//upload is a middleware function Middleware functions are functions that have access to the request object (req), the response object (res), 
//and the next function in the application’s request-response cycle,This anonymous function is middleware which works when there is a http request.

//upload.single() is also a middleware.This will ensure for request that are recieved in this route 
//multer will look into this request and if there is some image file attached it will give access to that file/image also other files which are there in form.

router.get('/new-user', function(req, res) {
  res.render('new-user');
});

module.exports = router;