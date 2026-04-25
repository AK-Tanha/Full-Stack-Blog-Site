const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    cta: {
        type: String,
        default: 'Learn More'
    },
    link: {
        type: String,
        required: true
    },
    slot: {
        type: String,
        required: true,
        enum: ['horizontal', 'sidebar', 'mobile', 'masthead']
    },
    category: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
