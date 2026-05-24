const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

let activeStatus = 'all';
let activeKeyword = '';

// Status filter buttons
document.querySelectorAll('.status-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeStatus = btn.dataset.status;
    loadTodos();
  });
});

// Keyword search input
document.getElementById('filter-input').addEventListener('input', (e) => {
  activeKeyword = e.target.value.trim();
  loadTodos();
});

async function loadTodos() {
  const params = new URLSearchParams({ status: activeStatus, keyword: activeKeyword });
  const res = await fetch(`/api/todos?${params}`);
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

loadTodos();
