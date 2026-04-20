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
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    // Upload to Vercel Blob
    // We use the original name and the buffer directly
    const blob = await put(req.file.originalname, req.file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN // Ensure this is in your .env
    });

    res.status(200).send({
      message: 'Image uploaded successfully to Vercel Blob',
      url: blob.url,
    });
  } catch (error) {
    console.error('Vercel Blob upload error:', error);
    res.status(500).send({ message: 'Failed to upload image', error: error.message });
  }
});

module.exports = router;
