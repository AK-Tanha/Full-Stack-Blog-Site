const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5001;

//parse option
app.use(express.json())
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'https://combablogs.vercel.app'
    ];
    
    // Check if origin is in allowed list or is a vercel.app domain
    if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}))

//routes
const blogRoutes = require('./src/routes/blog.route') ;
const commentRoutes = require('./src/routes/comment.route') ;
const userRoute = require ('./src/routes/auth.user');

// Cache connection promise for serverless optimization
let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }
  
  try {
    cachedConnection = mongoose.connect(process.env.MONGODB_URL);
    await cachedConnection;
    console.log("MongoDB Connected Successfully");
    return cachedConnection;
  } catch (err) {
    console.log("MongoDB Connection Error:", err);
    cachedConnection = null; // Reset on error
    throw err;
  }
}

// Middleware to ensure DB connection before handling requests
async function ensureDBConnection(req, res, next) {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).send({ 
      message: "Database connection failed", 
      error: err.message 
    });
  }
}

// Apply DB connection middleware to all API routes
app.use("/api/auth", ensureDBConnection, userRoute);
app.use("/api/blogs", ensureDBConnection, blogRoutes);
app.use("/api/comments", ensureDBConnection, commentRoutes);

app.get('/', (req, res) => {
  res.send('Server is running.....')
})

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

module.exports = app;
