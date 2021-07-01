require("dotenv/config")
const Post = require("../models/post")
const User = require("../models/user")
const multer = require('multer')
const AWS = require('aws-sdk')
const auth = require("../auth/index")
const {Router} = require("express")
const router = Router()

router.get("/:location",  async (req, res) => {
    try {
        const {location} = req.params
        res.status(200).json(await Post.find({location}))
    } 
     catch (error) {
         res.status(400).json({error})
     }
})

// AMAZON S3 FUNCTIONS
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({storage}).single('image')

//CREATE (UPLOAD IMAGE TO S3 & THE URL IMAGE ENDPOINT TO DATABASE)
router.post("/", auth, upload, async (req, res) => {
    try {
        const {username} = req.payload
        if(req.file) {
            let myFile = req.file.originalname.split(".")
            const fileType = myFile[myFile.length - 1]
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${Date.now()}.${fileType}`,
                Body: req.file.buffer 
            }
            s3.upload(params, (error, data) => {
                if(error) {
                    res.status(500).send(error)
                }
            })
            res.status(200).json(await Post.create({"image": params.Key, "realuser": username}))
        } else if (req.body) {
            res.status(200).json(await Post.create(req.body))
        } 
    }
     catch (error) {
        res.status(400).json({error})
    }
})

//UPDATE
router.put("/:id", auth, async (req, res) => {
    try {
        const {id} = req.params //req.params.id destructured
        res.status(200).json(await Post.findByIdAndUpdate(id, req.body, {new: true}))
    }
     catch (error) {
        res.status(400).json({error})
    }
})

///DELETE (For posts with images)///
router.delete("/:id", auth, async (req, res) => {
    try {
      // delete existing place in the database
      const deletedImage = await Post.findOneAndRemove({"image": req.params.id});
      // delete in S3
      var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.params.id
      };

      s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
      //return json data
      res.json(deletedImage);
    } catch (error) {
      // return error as JSON with an error status
      res.status(400).json(error);
    }
  });

///DELETE (For posts without images)///

module.exports = router