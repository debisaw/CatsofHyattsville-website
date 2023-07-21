// Requiring module
const express = require('express');
const path = require('path');
const fs = require('fs'); 
const multer = require('multer');
const AWS =require('aws-sdk');
require('dotenv').config();

// Creating express object
const app = express();
const imagesDirectory = path.join(__dirname,'images/cat-images'); 


const fileparser = require('./public/resume-parser/script/script_resume_parser')
// Defining port number
const PORT = 3000;
 
// Function to serve all static files
// inside public directory.
app.use(express.static('public'));
app.use('/images', express.static('images'));
 
app.get('/api/background-images', (req, res) => {
    try {
      const fileNames = fs.readdirSync(imagesDirectory);
      console.log('File names in the images directory:', fileNames);
      const imageUrls = fileNames.map((fileName) => path.join('images/cat-images', fileName));
      console.log('sending',imageUrls)
      res.json(imageUrls);
    } catch (error) {
      console.error('Error reading the images directory:', error);
      res.status(500).json({ error: 'Failed to read images directory' });
    }
  });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

const s3 = new AWS.S3();
const upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');
app.use(bodyParser.json());



app.post('/api/upload', upload.single('resumeFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Access file details
  const { originalname, filename, path, mimetype, size } = req.file;

  // Create a readable stream from the uploaded file
  const fileReadStream = fs.createReadStream(path);

  // Specify the S3 bucket and key for the uploaded file
  const bucketName = 'catsofhyattsville';
  const s3Key = `${originalname}`; // Set the key according to your desired folder structure in the bucket

  // Upload the file to S3 using the AWS SDK
  const params = {
    Bucket: bucketName,
    Key: s3Key,
    Body: fileReadStream,
  };

  try {
    await s3.upload(params).promise();
    // File uploaded successfully to S3, perform further processing or return a response to the client
    fs.unlinkSync(path)
    return res.json({ message: 'File uploaded successfully', fileDetails: req.file });
  } catch (err) {
    console.error('Error uploading file to S3:', err);
    return res.status(500).json({ error: 'Failed to upload file to S3' });
  }
});



  /*
    await fileparser(req)
    .then(data => {
      res.status(200).json({
        message: "Success",
        data
      })
    })
    .catch(error => {
      res.status(400).json({
        message: "An error occurred.",
        error
      })
    }) */


// Server setup
app.listen(PORT, () => {
    console.log(`Running server on PORT ${PORT}...`);
})