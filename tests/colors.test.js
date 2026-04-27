import test from 'node:test';
import assert from 'node:assert/strict';
import { colorStatus, colorPriority } from '../src/utils/colors.js';

test('colorStatus returns a string containing the status value for done', () => {
  const result = colorStatus('done');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('done'));
});

test('colorStatus returns a string containing the status value for in-progress', () => {
  const result = colorStatus('in-progress');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('in-progress'));
});

test('colorStatus returns a string containing the status value for todo', () => {
  const result = colorStatus('todo');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('todo'));
});

test('colorStatus trims surrounding whitespace before matching', () => {
  const result = colorStatus('  done  ');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('done'));
});

test('colorStatus rejects non-string input', () => {
  assert.throws(() => colorStatus(42), {
    name: 'TypeError',
    message: 'Invalid input: status must be a string.'
  });
});

test('colorStatus rejects unsupported status values', () => {
  assert.throws(() => colorStatus('blocked'), {
    name: 'TypeError',
    message: 'Invalid input: status must be one of todo, in-progress, done.'
  });
});

test('colorPriority returns a string containing the priority value for high', () => {
  const result = colorPriority('high');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('high'));
});

test('colorPriority returns a string containing the priority value for medium', () => {
  const result = colorPriority('medium');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('medium'));
});

test('colorPriority returns a string containing the priority value for low', () => {
  const result = colorPriority('low');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('low'));
});

test('colorPriority trims surrounding whitespace before matching', () => {
  const result = colorPriority('  high  ');
  assert.equal(typeof result, 'string');
  assert.ok(result.includes('high'));
});

test('colorPriority rejects non-string input', () => {
  assert.throws(() => colorPriority(null), {
    name: 'TypeError',
    message: 'Invalid input: priority must be a string.'
  });
});

test('colorPriority rejects unsupported priority values', () => {
  assert.throws(() => colorPriority('urgent'), {
    name: 'TypeError',
    message: 'Invalid input: priority must be one of low, medium, high.'
  });
});
