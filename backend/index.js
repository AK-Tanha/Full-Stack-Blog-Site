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
    
    // Allow any localhost or 127.0.0.1 and vercel app
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1') || origin.includes('vercel.app')) {
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

app.use("/api/auth", userRoute);
app.use("/api/blogs",blogRoutes) ;
app.use("/api/comments",commentRoutes) ;


async function main() {
  await mongoose.connect(process.env.MONGODB_URL);


  app.get('/', (req, res) => {
  res.send('Server is running.....')
})
}
main().then(() => console.log("MongoDB Connected Successfully")).catch(err => console.log(err));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
