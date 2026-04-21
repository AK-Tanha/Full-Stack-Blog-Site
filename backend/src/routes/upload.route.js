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
  console.log('File:', req.file ? {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  } : 'No file');

  try {
    if (!req.file) {
      console.error('Upload Error: No file provided in request');
      return res.status(400).send({ message: 'No file uploaded' });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('Upload Error: BLOB_READ_WRITE_TOKEN is missing in environment variables');
      return res.status(500).send({ message: 'Server configuration error: Upload token missing' });
    }

    // Upload to Vercel Blob (Public Access)
    console.log('Attempting Vercel Blob upload...');
    const blob = await put(req.file.originalname, req.file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    console.log('Vercel Blob Upload Success:', blob.url);

    res.status(200).send({
      message: 'Image uploaded successfully to Vercel Blob',
      url: blob.url,
    });
  } catch (error) {
    console.error('Vercel Blob upload error details:', error);
    res.status(500).send({ 
      message: 'Failed to upload image', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
