import test from 'node:test';
import assert from 'node:assert/strict';
import { createTaskService } from '../src/services/taskService.js';

test('createTask stores and returns a normalized task', () => {
  const service = createTaskService();

  const created = service.createTask({
    title: '  Implement service tests  ',
    priority: 'high'
  });

  assert.equal(created.title, 'Implement service tests');
  assert.equal(created.priority, 'high');
  assert.equal(created.status, 'todo');
  assert.equal(created.category, 'general');
  assert.equal(typeof created.id, 'string');
});

test('createTask accepts an explicit category value', () => {
  const service = createTaskService();

  const created = service.createTask({
    title: 'Category test',
    category: 'work'
  });

  assert.equal(created.category, 'work');
});

test('listTasks returns copies rather than internal references', () => {
  const service = createTaskService();

  const created = service.createTask({ title: 'Reference check' });
  const listed = service.listTasks();
  listed[0].title = 'Changed outside';

  const refreshed = service.listTasks();

  assert.equal(refreshed[0].title, created.title);
});

test('updateTask updates existing task data', () => {
  const service = createTaskService();
  const created = service.createTask({ title: 'Before update', priority: 'low' });

  const updated = service.updateTask(created.id, {
    title: 'After update',
    status: 'in-progress',
    category: 'personal'
  });

  assert.equal(updated.title, 'After update');
  assert.equal(updated.status, 'in-progress');
  assert.equal(updated.priority, 'low');
  assert.equal(updated.category, 'personal');
});

test('updateTask throws for missing task id', () => {
  const service = createTaskService();

  assert.throws(() => service.updateTask('missing-id', { status: 'done' }), {
    name: 'Error',
    message: 'Task not found: missing-id'
  });
});

test('deleteTask removes and returns deleted task', () => {
  const service = createTaskService();
  const created = service.createTask({ title: 'Delete me' });

  const deleted = service.deleteTask(created.id);

  assert.equal(deleted.id, created.id);
  assert.equal(service.listTasks().length, 0);
});

test('deleteTask throws for missing task id', () => {
  const service = createTaskService();

  assert.throws(() => service.deleteTask('not-here'), {
    name: 'Error',
    message: 'Task not found: not-here'
  });
});

test('listTasks filters by status and priority', () => {
  const service = createTaskService();

  service.createTask({ title: 'A', status: 'todo', priority: 'high' });
  service.createTask({ title: 'B', status: 'done', priority: 'high' });
  service.createTask({ title: 'C', status: 'todo', priority: 'low' });

  const result = service.listTasks({ status: 'todo', priority: 'high' });

  assert.equal(result.length, 1);
  assert.equal(result[0].title, 'A');
});

test('listTasks filters by category only', () => {
  const service = createTaskService();

  service.createTask({ title: 'A', category: 'work' });
  service.createTask({ title: 'B', category: 'personal' });

  const result = service.listTasks({ category: 'work' });

  assert.equal(result.length, 1);
  assert.equal(result[0].title, 'A');
  assert.equal(result[0].category, 'work');
});

test('listTasks combines category with other filters', () => {
  const service = createTaskService();

  service.createTask({ title: 'A', status: 'todo', priority: 'high', category: 'work' });
  service.createTask({ title: 'B', status: 'todo', priority: 'high', category: 'personal' });
  service.createTask({ title: 'C', status: 'done', priority: 'high', category: 'work' });

  const result = service.listTasks({ status: 'todo', priority: 'high', category: 'work' });

  assert.equal(result.length, 1);
  assert.equal(result[0].title, 'A');
});

test('listTasks sorts by priority descending', () => {
  const service = createTaskService();

  service.createTask({ title: 'Low', priority: 'low' });
  service.createTask({ title: 'High', priority: 'high' });
  service.createTask({ title: 'Medium', priority: 'medium' });

  const sorted = service.listTasks({ sortBy: 'priority', order: 'desc' });

  assert.deepEqual(
    sorted.map((task) => task.priority),
    ['high', 'medium', 'low']
  );
});

test('createTask rejects invalid create payloads', () => {
  const service = createTaskService();

  assert.throws(() => service.createTask({ title: '' }), {
    name: 'TypeError',
    message: 'Invalid input: title cannot be empty.'
  });
});
