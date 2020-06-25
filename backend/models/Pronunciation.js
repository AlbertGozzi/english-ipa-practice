const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pronunciationSchema = new Schema({
    word: String,
    pronunciation: String,
    frequency: Number,
})

const Pronunciation = mongoose.model('Pronunciation', pronunciationSchema);

module.exports = Pronunciation;