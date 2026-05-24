'use strict';

const { describe, it, before, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// We need to require the app and use an HTTP test approach without supertest.
// We'll directly test the router logic by constructing mock req/res objects.

function makeReq(query = {}) {
  return { query, params: {}, body: {} };
}

function makeRes() {
  const res = {
    _status: 200,
    _body: null,
    status(code) { this._status = code; return this; },
    json(data) { this._body = data; return this; },
    send() { return this; }
  };
  return res;
}

// We need access to the internal todos array. We'll reset modules between tests
// by requiring a fresh router each time via a helper.

describe('GET /api/todos — filter by status and keyword', () => {
  let router;
  let todos;

  // Helper: find the route handler for GET '/'
  function getHandler() {
    // Express router stores layers; find the one matching GET /
    const layer = router.stack.find(
      l => l.route && l.route.path === '/' && l.route.methods.get
    );
    return layer.route.stack[0].handle;
  }

  // Helper: POST a todo directly through the router handler
  function addTodo(title, completed = false) {
    const req = { query: {}, params: {}, body: { title } };
    const res = makeRes();
    const postLayer = router.stack.find(
      l => l.route && l.route.path === '/' && l.route.methods.post
    );
    postLayer.route.stack[0].handle(req, res, () => {});
    if (completed) {
      const created = res._body;
      const putLayer = router.stack.find(
        l => l.route && l.route.path === '/:id' && l.route.methods.put
      );
      const req2 = { query: {}, params: { id: String(created.id) }, body: { completed: true } };
      const res2 = makeRes();
      putLayer.route.stack[0].handle(req2, res2, () => {});
    }
    return res._body;
  }

  beforeEach(() => {
    // Clear module cache so todos array resets between tests
    delete require.cache[require.resolve('./todos')];
    router = require('./todos');
  });

  it('no params — returns all todos', () => {
    addTodo('Buy milk');
    addTodo('Walk dog', true);

    const req = makeReq({});
    const res = makeRes();
    getHandler()(req, res, () => {});

    assert.equal(res._body.length, 2);
  });

  it('status=active — returns only active todos', () => {
    addTodo('Buy milk');
    addTodo('Walk dog', true);

    const req = makeReq({ status: 'active' });
    const res = makeRes();
    getHandler()(req, res, () => {});

    assert.equal(res._body.length, 1);
    assert.equal(res._body[0].completed, false);
    assert.equal(res._body[0].title, 'Buy milk');
  });

  it('status=completed — returns only completed todos', () => {
    addTodo('Buy milk');
    addTodo('Walk dog', true);

    const req = makeReq({ status: 'completed' });
    const res = makeRes();
    getHandler()(req, res, () => {});

    assert.equal(res._body.length, 1);
    assert.equal(res._body[0].completed, true);
    assert.equal(res._body[0].title, 'Walk dog');
  });

  it('keyword=buy — returns todos containing keyword (case-insensitive)', () => {
    addTodo('Buy milk');
    addTodo('Walk dog', true);
    addTodo('buy groceries');

    const req = makeReq({ keyword: 'buy' });
    const res = makeRes();
    getHandler()(req, res, () => {});

    assert.equal(res._body.length, 2);
    assert.ok(res._body.every(t => t.title.toLowerCase().includes('buy')));
  });

  it('status=active&keyword=buy — intersection filter', () => {
    addTodo('Buy milk');        // active, matches keyword
    addTodo('buy groceries', true); // completed, matches keyword
    addTodo('Walk dog');        // active, no keyword match

    const req = makeReq({ status: 'active', keyword: 'buy' });
    const res = makeRes();
    getHandler()(req, res, () => {});

    assert.equal(res._body.length, 1);
    assert.equal(res._body[0].title, 'Buy milk');
    assert.equal(res._body[0].completed, false);
  });

  it('status=all — returns all todos (explicit all)', () => {
    addTodo('Buy milk');
    addTodo('Walk dog', true);

    const req = makeReq({ status: 'all' });
    const res = makeRes();
    getHandler()(req, res, () => {});

    assert.equal(res._body.length, 2);
  });

  it('empty todos — returns empty array', () => {
    const req = makeReq({ status: 'active', keyword: 'test' });
    const res = makeRes();
    getHandler()(req, res, () => {});

    assert.deepEqual(res._body, []);
  });
});
