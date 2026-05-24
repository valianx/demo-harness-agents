const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

// We need a fresh router for each test to avoid shared state.
// Re-require a fresh express app each test by clearing the module cache.
function createApp() {
  // Delete cached modules so we get a fresh in-memory store each time
  const keys = Object.keys(require.cache).filter(k => k.includes('routes/todos') || k.includes('src/index'));
  keys.forEach(k => delete require.cache[k]);
  return require('../index');
}

function makeRequest(baseUrl, method, path, data) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: new URL(baseUrl).hostname,
      port: new URL(baseUrl).port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: body ? JSON.parse(body) : null });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function seedTodos(baseUrl) {
  // Create 3 todos: "Buy milk" (completed), "Buy eggs" (active), "Call dentist" (active)
  const r1 = await makeRequest(baseUrl, 'POST', '/api/todos', { title: 'Buy milk' });
  await makeRequest(baseUrl, 'PUT', `/api/todos/${r1.body.id}`, { completed: true });
  await makeRequest(baseUrl, 'POST', '/api/todos', { title: 'Buy eggs' });
  await makeRequest(baseUrl, 'POST', '/api/todos', { title: 'Call dentist' });
}

function startServer() {
  return new Promise((resolve) => {
    const app = createApp();
    const server = app.listen(0, () => {
      const baseUrl = `http://localhost:${server.address().port}`;
      resolve({ server, baseUrl });
    });
  });
}

function stopServer(server) {
  return new Promise(resolve => server.close(resolve));
}

describe('GET /api/todos — filtering', () => {
  test('returns all todos when no query params', async () => {
    const { server, baseUrl } = await startServer();
    await seedTodos(baseUrl);
    const { status, body } = await makeRequest(baseUrl, 'GET', '/api/todos');
    assert.equal(status, 200);
    assert.equal(body.length, 3);
    await stopServer(server);
  });

  test('returns only incomplete todos when status=active', async () => {
    const { server, baseUrl } = await startServer();
    await seedTodos(baseUrl);
    const { status, body } = await makeRequest(baseUrl, 'GET', '/api/todos?status=active');
    assert.equal(status, 200);
    assert.ok(body.length > 0, 'should return at least one active todo');
    assert.ok(body.every(t => t.completed === false), 'all returned todos must be incomplete');
    await stopServer(server);
  });

  test('returns only completed todos when status=completed', async () => {
    const { server, baseUrl } = await startServer();
    await seedTodos(baseUrl);
    const { status, body } = await makeRequest(baseUrl, 'GET', '/api/todos?status=completed');
    assert.equal(status, 200);
    assert.ok(body.length > 0, 'should return at least one completed todo');
    assert.ok(body.every(t => t.completed === true), 'all returned todos must be completed');
    await stopServer(server);
  });

  test('filters by keyword case-insensitively', async () => {
    const { server, baseUrl } = await startServer();
    await seedTodos(baseUrl);
    const { status, body } = await makeRequest(baseUrl, 'GET', '/api/todos?keyword=BUY');
    assert.equal(status, 200);
    assert.equal(body.length, 2, 'should return exactly two todos matching "buy"');
    assert.ok(body.every(t => t.title.toLowerCase().includes('buy')));
    await stopServer(server);
  });

  test('combines status and keyword filters (AND logic)', async () => {
    const { server, baseUrl } = await startServer();
    await seedTodos(baseUrl);
    // "Buy milk" is completed, "Buy eggs" is active — ?status=active&keyword=buy should return only "Buy eggs"
    const { status, body } = await makeRequest(baseUrl, 'GET', '/api/todos?status=active&keyword=buy');
    assert.equal(status, 200);
    assert.equal(body.length, 1);
    assert.equal(body[0].title, 'Buy eggs');
    assert.equal(body[0].completed, false);
    await stopServer(server);
  });
});
