const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageURL: { type: String },
    tags: [String],
    name: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const TemplateModel = mongoose.model('Template', TemplateSchema);

module.exports = TemplateModel;
