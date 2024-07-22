const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: String,
    completed: Boolean,
    date: {
        type: String, 
        required: true
    },
    mark: {
        type: Number,
        default: 0,
        min: 0,
        max: 10
    }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
