const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const todoRoutes = require('./routes/todo');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.get('/todolist', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'todo.html'));
});
app.get('/expense', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'expense.html'));
});

app.use('/todos', todoRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});