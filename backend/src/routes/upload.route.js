const express = require('express');
const multer = require('multer');
const { put } = require('@vercel/blob');
require('dotenv').config();

const router = express.Router();

// Multer Storage Configuration (using memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Endpoint
router.post('/upload', upload.single('image'), async (req, res) => {
  console.log('--- Upload Request Received ---');
  
  try {
    if (!req.file) {
      console.error('Upload Error: No file provided in request. Check field name (should be "image")');
      return res.status(400).send({ message: 'No file uploaded', details: 'req.file is undefined' });
    }

    console.log('File details:', {
      name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('Upload Error: BLOB_READ_WRITE_TOKEN is missing');
      return res.status(500).send({ message: 'Server configuration error: Upload token missing' });
    }

    // Upload to Vercel Blob (Public Access)
    const filename = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    console.log('Attempting Vercel Blob upload as:', filename);
    
    try {
      const blob = await put(filename, req.file.buffer, {
        access: 'public',
        contentType: req.file.mimetype,
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      console.log('Vercel Blob Upload Success:', blob.url);

      return res.status(200).send({
        message: 'Image uploaded successfully',
        url: blob.url,
      });
    } catch (blobError) {
      console.error('Vercel Blob Library Error:', blobError);
      return res.status(500).send({ 
        message: 'Vercel Blob storage failure', 
        error: blobError.message,
        details: blobError.code || 'Check token permissions'
      });
    }
  } catch (error) {
    console.error('General Upload Route Error:', error);
    res.status(500).send({ 
      message: 'Failed to process upload request', 
      error: error.message 
    });
  }
});

module.exports = router;
