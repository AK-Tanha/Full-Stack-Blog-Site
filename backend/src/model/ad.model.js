const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    title_bn: {
        type: String
    },
    subtitle: {
        type: String
    },
    subtitle_bn: {
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
