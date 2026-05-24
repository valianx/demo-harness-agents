const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');

async function loadTodos() {
  const q = searchInput ? searchInput.value.trim() : '';
  const completed = statusFilter ? statusFilter.value : '';

  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (completed !== '') params.set('completed', completed);

  const url = '/api/todos' + (params.toString() ? '?' + params.toString() : '');
  const res = await fetch(url);
  const todos = await res.json();
  list.innerHTML = '';
  todos.forEach(renderTodo);
}

searchInput && searchInput.addEventListener('input', loadTodos);
statusFilter && statusFilter.addEventListener('change', loadTodos);

function renderTodo(todo) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.completed ? ' completed' : ''}`;
  li.innerHTML = `
    <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id}, this.checked)">
    <span>${todo.title}</span>
    <button onclick="deleteTodo(${todo.id})">&times;</button>
  `;
  list.appendChild(li);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;

  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  input.value = '';
  loadTodos();
});

async function toggleTodo(id, completed) {
  await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  loadTodos();
}

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  loadTodos();
}

loadTodos();
