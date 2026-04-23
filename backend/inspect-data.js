const mongoose = require('mongoose');
const User = require('./src/model/user.model');
const Comment = require('./src/model/comment.model');
require('dotenv').config();

async function inspect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'username email profileImage');
    console.log('--- Users ---');
    console.log(JSON.stringify(users, null, 2));

    const comments = await Comment.find({}).populate('user', 'username profileImage').limit(5);
    console.log('--- Recent Comments ---');
    console.log(JSON.stringify(comments, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Inspection failed:', error);
    process.exit(1);
  }
}

inspect();
