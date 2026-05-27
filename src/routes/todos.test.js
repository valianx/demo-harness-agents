const { describe, it, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const http = require('node:http');

function createApp() {
  // Fresh router for each test suite — isolates the in-memory todos array
  // We re-require the module to get a fresh todos array
  delete require.cache[require.resolve('./todos')];
  const todosRouter = require('./todos');

  const app = express();
  app.use(express.json());
  app.use('/api/todos', todosRouter);
  return app;
}

function request(server, method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, `http://localhost:${server.address().port}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe('GET /api/todos — filtrado por query params', () => {
  let server;

  beforeEach(async () => {
    const app = createApp();
    server = app.listen(0); // random available port

    // Seed test data: 3 todos with different states
    await request(server, 'POST', '/api/todos', { title: 'Buy groceries' });
    await request(server, 'POST', '/api/todos', { title: 'Clean house' });
    await request(server, 'POST', '/api/todos', { title: 'Buy birthday gift' });

    // Mark "Clean house" as completed
    await request(server, 'PUT', '/api/todos/2', { completed: true });
  });

  after(() => {
    if (server) server.close();
  });

  // AC-5: sin query params retorna todos los todos
  it('should return all todos when no query params are sent', async () => {
    const res = await request(server, 'GET', '/api/todos');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 3);
  });

  // AC-1: ?status=completed retorna solo los completados
  it('should return only completed todos when ?status=completed', async () => {
    const res = await request(server, 'GET', '/api/todos?status=completed');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].title, 'Clean house');
    assert.equal(res.body[0].completed, true);
  });

  // AC-2: ?status=pending retorna solo los pendientes
  it('should return only pending todos when ?status=pending', async () => {
    const res = await request(server, 'GET', '/api/todos?status=pending');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
    for (const todo of res.body) {
      assert.equal(todo.completed, false);
    }
  });

  // AC-3: ?q=keyword filtra por titulo (case-insensitive)
  it('should return todos matching keyword in title (case-insensitive)', async () => {
    const res = await request(server, 'GET', '/api/todos?q=buy');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
    for (const todo of res.body) {
      assert.ok(todo.title.toLowerCase().includes('buy'));
    }
  });

  // AC-3: keyword sin resultados retorna array vacio
  it('should return empty array when keyword matches no todos', async () => {
    const res = await request(server, 'GET', '/api/todos?q=nonexistent');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 0);
  });

  // AC-4: combinacion de status + q filtra ambos
  it('should filter by both status and keyword when both params are sent', async () => {
    const res = await request(server, 'GET', '/api/todos?status=pending&q=buy');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
    for (const todo of res.body) {
      assert.equal(todo.completed, false);
      assert.ok(todo.title.toLowerCase().includes('buy'));
    }
  });

  // AC-4: combinacion de status=completed + q con match
  it('should return empty when combining status=completed with keyword that only matches pending', async () => {
    const res = await request(server, 'GET', '/api/todos?status=completed&q=buy');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 0);
  });
});
