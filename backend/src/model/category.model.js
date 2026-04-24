const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    name_bn: String
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
