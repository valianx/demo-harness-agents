const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const statusFilter = document.getElementById('status-filter');
const keywordFilter = document.getElementById('keyword-filter');

async function loadTodos() {
  const status = statusFilter.value;
  const keyword = keywordFilter.value.trim();
  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  if (keyword) params.set('keyword', keyword);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`/api/todos${query}`);
  const todos = await res.json();
  list.innerHTML = '';
  todos.forEach(renderTodo);
}

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

statusFilter.addEventListener('change', loadTodos);
keywordFilter.addEventListener('input', loadTodos);

loadTodos();
