const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    title_bn: String,
    description: String,
    description_bn: String,
    content: {
        type: Object,
        required: true
    },
    content_bn: Object,
    coverImg: String,
    category: String,
    category_bn: String,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;