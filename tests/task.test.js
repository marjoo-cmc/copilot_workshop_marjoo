import test from 'node:test';
import assert from 'node:assert/strict';
import { Task } from '../src/models/task.js';

test('Task constructor applies defaults and normalization', () => {
  const task = new Task({
    title: '  Build test plan  ',
    description: '  cover paths  '
  });

  assert.equal(typeof task.id, 'string');
  assert.equal(task.title, 'Build test plan');
  assert.equal(task.description, 'cover paths');
  assert.equal(task.status, 'todo');
  assert.equal(task.priority, 'medium');
  assert.equal(task.category, 'general');
});

test('Task constructor rejects invalid id values', () => {
  assert.throws(
    () =>
      new Task({
        id: '   ',
        title: 'Valid title'
      }),
    {
      name: 'TypeError',
      message: 'Invalid input: id must be a non-empty string.'
    }
  );
});

test('Task constructor rejects invalid createdAt values', () => {
  assert.throws(
    () =>
      new Task({
        title: 'Valid title',
        createdAt: 'not-a-date'
      }),
    {
      name: 'TypeError',
      message: 'Invalid input: createdAt must be a valid ISO timestamp.'
    }
  );
});

test('Task update changes selected fields and refreshes updatedAt', () => {
  const task = new Task({
    id: 'task-1',
    title: 'Initial',
    createdAt: '2000-01-01T00:00:00.000Z',
    updatedAt: '2000-01-01T00:00:00.000Z'
  });

  task.update({ status: 'done', priority: 'high' });

  assert.equal(task.status, 'done');
  assert.equal(task.priority, 'high');
  assert.ok(Date.parse(task.updatedAt) > Date.parse('2000-01-01T00:00:00.000Z'));
});

test('Task update supports category changes', () => {
  const task = new Task({ title: 'Categorize me' });

  task.update({ category: 'work' });

  assert.equal(task.category, 'work');
});

test('Task update rejects payloads with no updatable fields', () => {
  const task = new Task({ title: 'Any title' });

  assert.throws(() => task.update({ ignored: true }), {
    name: 'TypeError',
    message: 'Invalid input: at least one updatable field is required.'
  });
});

test('Task toJSON returns a detached plain object', () => {
  const task = new Task({ id: 'task-2', title: 'Serialize me' });

  const serialized = task.toJSON();
  serialized.title = 'Mutated title';

  assert.equal(task.title, 'Serialize me');
  assert.equal(serialized.id, 'task-2');
  assert.equal(serialized.category, 'general');
});
