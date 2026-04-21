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

    // Upload to Vercel Blob
    console.log('Attempting Vercel Blob upload...');
    const blob = await put(req.file.originalname, req.file.buffer, {
      // NOTE: If your store is configured as 'private', you MUST use 'private' here.
      // However, for blog images to be visible to everyone, a 'public' store is recommended.
      access: 'private', 
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    console.log('Vercel Blob Upload Success:', blob.url);

    // Create a proxy URL that points to our local backend
    // This allows private images to be viewed through our server
    const proxyUrl = `${req.protocol}://${req.get('host')}/api/upload/view?url=${encodeURIComponent(blob.url)}`;

    res.status(200).send({
      message: 'Image uploaded successfully (Private Proxy enabled)',
      url: proxyUrl,
      originalUrl: blob.url // Keeping this just in case
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

// Proxy Route to view private images
router.get('/view', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).send({ message: 'URL query parameter is required' });
  }

  try {
    console.log('Proxying private blob:', url);
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error('Vercel Blob Fetch Error:', response.status, response.statusText);
      return res.status(response.status).send({ message: 'Failed to fetch image from Vercel' });
    }

    // Set headers from the original response
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'private, max-age=3600'); // Cache for 1 hour locally
    
    // Convert Web Stream to Node Stream and pipe to response
    const { Readable } = require('stream');
    const body = response.body;
    
    if (body) {
      Readable.fromWeb(body).pipe(res);
    } else {
      res.status(404).send({ message: 'No content found' });
    }
  } catch (error) {
    console.error('Proxy Route Error:', error);
    res.status(500).send({ message: 'Error proxying image', error: error.message });
  }
});

module.exports = router;
