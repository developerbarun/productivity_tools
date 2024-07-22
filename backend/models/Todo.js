const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: String,
    completed: Boolean,
    date: {
        type: Date,
        default: Date.now
    }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
