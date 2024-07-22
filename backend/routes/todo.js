const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post('/', async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        completed: req.body.completed
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo); 
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(204).end(); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;