const { describe, it, before, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../index');

// Helper to make HTTP requests to the test server
function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path,
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch { parsed = data; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const TEST_PORT = 3099;
let server;

before(async () => {
  server = app.listen(TEST_PORT);
  await new Promise(resolve => server.on('listening', resolve));
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close(err => err ? reject(err) : resolve())
  );
});

// Reset todos before each test by deleting all existing todos
beforeEach(async () => {
  const list = await request('GET', '/api/todos');
  for (const todo of list.body) {
    await request('DELETE', `/api/todos/${todo.id}`);
  }
});

describe('GET /api/todos — filter by query params', () => {
  it('returns all todos when no query params are provided', async () => {
    await request('POST', '/api/todos', { title: 'Buy groceries' });
    await request('POST', '/api/todos', { title: 'Walk the dog' });

    const res = await request('GET', '/api/todos');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
  });

  it('filters by completed=true', async () => {
    const r1 = await request('POST', '/api/todos', { title: 'Task A' });
    const r2 = await request('POST', '/api/todos', { title: 'Task B' });
    await request('PUT', `/api/todos/${r1.body.id}`, { completed: true });

    const res = await request('GET', '/api/todos?completed=true');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].id, r1.body.id);
    assert.equal(res.body[0].completed, true);
  });

  it('filters by completed=false', async () => {
    const r1 = await request('POST', '/api/todos', { title: 'Task A' });
    const r2 = await request('POST', '/api/todos', { title: 'Task B' });
    await request('PUT', `/api/todos/${r1.body.id}`, { completed: true });

    const res = await request('GET', '/api/todos?completed=false');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].id, r2.body.id);
    assert.equal(res.body[0].completed, false);
  });

  it('returns all todos when completed param is not true or false', async () => {
    await request('POST', '/api/todos', { title: 'Task A' });
    await request('POST', '/api/todos', { title: 'Task B' });

    const res = await request('GET', '/api/todos?completed=all');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
  });

  it('filters by keyword q (case-insensitive)', async () => {
    await request('POST', '/api/todos', { title: 'Buy groceries' });
    await request('POST', '/api/todos', { title: 'Walk the dog' });

    const res = await request('GET', '/api/todos?q=buy');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].title, 'Buy groceries');
  });

  it('keyword search is case-insensitive', async () => {
    await request('POST', '/api/todos', { title: 'Buy Groceries' });

    const res = await request('GET', '/api/todos?q=BUY');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
  });

  it('returns all todos when q is empty string', async () => {
    await request('POST', '/api/todos', { title: 'Task A' });
    await request('POST', '/api/todos', { title: 'Task B' });

    const res = await request('GET', '/api/todos?q=');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
  });

  it('applies both completed and q filters together (AND logic)', async () => {
    const r1 = await request('POST', '/api/todos', { title: 'Buy groceries' });
    const r2 = await request('POST', '/api/todos', { title: 'Buy milk' });
    await request('POST', '/api/todos', { title: 'Walk the dog' });
    await request('PUT', `/api/todos/${r1.body.id}`, { completed: true });

    const res = await request('GET', '/api/todos?completed=true&q=buy');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].id, r1.body.id);
  });

  it('returns empty array when no todos match the filters', async () => {
    await request('POST', '/api/todos', { title: 'Walk the dog' });

    const res = await request('GET', '/api/todos?q=nonexistent');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 0);
  });
});
