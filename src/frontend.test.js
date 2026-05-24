const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const htmlPath = path.join(__dirname, '../public/index.html');
const jsPath = path.join(__dirname, '../public/app.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

describe('Frontend filter controls — static analysis', () => {
  test('index.html contains a status-filter select with all/active/completed options', () => {
    assert.ok(html.includes('id="status-filter"'), 'status-filter select must exist');
    assert.ok(html.includes('value="all"'), 'option "all" must exist');
    assert.ok(html.includes('value="active"'), 'option "active" must exist');
    assert.ok(html.includes('value="completed"'), 'option "completed" must exist');
  });

  test('index.html contains a keyword-filter text input', () => {
    assert.ok(html.includes('id="keyword-filter"'), 'keyword-filter input must exist');
    assert.ok(html.includes('type="text"'), 'keyword-filter must be a text input');
  });

  test('filter controls appear before the todo list in the DOM', () => {
    const filtersPos = html.indexOf('id="status-filter"');
    const listPos = html.indexOf('id="todo-list"');
    assert.ok(filtersPos < listPos, 'filter controls must appear before #todo-list');
  });

  test('app.js reads status-filter and keyword-filter values in loadTodos', () => {
    assert.ok(js.includes('status-filter'), 'app.js must reference status-filter element');
    assert.ok(js.includes('keyword-filter'), 'app.js must reference keyword-filter element');
    assert.ok(js.includes('/api/todos'), 'app.js must fetch /api/todos');
  });

  test('app.js appends query params when filter values are set', () => {
    assert.ok(js.includes('URLSearchParams'), 'app.js must use URLSearchParams to build query');
    assert.ok(js.includes("params.set('status'") || js.includes('params.set("status"'), 'app.js must set status param');
    assert.ok(js.includes("params.set('keyword'") || js.includes('params.set("keyword"'), 'app.js must set keyword param');
  });

  test('app.js registers change listener on status-filter', () => {
    assert.ok(
      js.includes("statusFilter.addEventListener('change'") || js.includes('statusFilter.addEventListener("change"'),
      'app.js must add change listener to statusFilter'
    );
  });

  test('app.js registers input listener on keyword-filter', () => {
    assert.ok(
      js.includes("keywordFilter.addEventListener('input'") || js.includes('keywordFilter.addEventListener("input"'),
      'app.js must add input listener to keywordFilter'
    );
  });
});
