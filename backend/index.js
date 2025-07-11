const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//parse option
app.use (express.json())
app.use(cors({
  origin: 'http://localhost:5173',
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
