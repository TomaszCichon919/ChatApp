const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    author: { type: String, required: false },
    content: { type: String, required: false },
});

module.exports = mongoose.model('Message', messageSchema);
