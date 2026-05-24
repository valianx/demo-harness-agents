const { Router } = require('express');

const router = Router();

const todos = [];
let nextId = 1;

router.get('/', (req, res) => {
  const { completed, q } = req.query;

  let result = todos;

  if (completed === 'true') {
    result = result.filter(t => t.completed === true);
  } else if (completed === 'false') {
    result = result.filter(t => t.completed === false);
  }

  if (q && q.trim() !== '') {
    const search = q.toLowerCase();
    result = result.filter(t => t.title.toLowerCase().includes(search));
  }

  res.json(result);
});

router.get('/:id', (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const todo = {
    id: nextId++,
    title,
    completed: false,
    createdAt: new Date().toISOString()
  };

  todos.push(todo);
  res.status(201).json(todo);
});

router.put('/:id', (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });

  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  res.json(todo);
});

router.delete('/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });

  todos.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
