const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { 
  setupDB, createTodo, getTodos, 
  getSingleTodo, updateTodo, deleteTodo 
} = require('./db/db');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

setupDB();

app.get('/', (req, res) => {
  res.json({message: "hello world"})
});

// GET /todos → fetch all todos
app.get('/todos', (req, res) => {
  try {
    const todos = getTodos();
    console.log(todos)
    res.json({ data: todos.length > 0 ? todos : [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /todos/:id → fetch a single todo
app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  try {
    const todo = getSingleTodo(id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /todos → add a new todo (fields: title, completed)
app.post('/todos', (req, res) => {
  const { title, description = "", completed = 0 } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  try {
    const result = createTodo(title, description);
    // Set completed if provided
    if (typeof completed !== 'undefined') {
      updateTodo(title, description, completed ? 1 : 0, result.lastInsertRowid);
    }
    const todo = getSingleTodo(result.lastInsertRowid);
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /todos/:id → update a todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, description = "", completed = 0 } = req.body;
  try {
    const result = updateTodo(title, description, completed ? 1 : 0, id);
    if (result.changes === 0) return res.status(404).json({ error: 'Todo not found' });
    const todo = getSingleTodo(id);
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /todos/:id → delete a todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  try {
    const result = deleteTodo(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Express todo app listening at http://localhost:${port}`);
});
