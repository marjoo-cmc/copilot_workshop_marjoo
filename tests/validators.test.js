import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCategory,
  validateDescription,
  validateListOptions,
  validatePriority,
  validateStatus,
  validateTaskInput,
  validateTaskUpdateInput,
  validateTitle
} from '../src/utils/validators.js';

test('validateTitle trims surrounding whitespace', () => {
  const result = validateTitle('  Plan sprint  ');
  assert.equal(result, 'Plan sprint');
});

test('validateTitle rejects non-string values', () => {
  assert.throws(() => validateTitle(10), {
    name: 'TypeError',
    message: 'Invalid input: title must be a string.'
  });
});

test('validateDescription returns empty string for undefined', () => {
  const result = validateDescription(undefined);
  assert.equal(result, '');
});

test('validateDescription rejects non-string values', () => {
  assert.throws(() => validateDescription(false), {
    name: 'TypeError',
    message: 'Invalid input: description must be a string.'
  });
});

test('validateStatus returns default value when undefined', () => {
  const result = validateStatus(undefined);
  assert.equal(result, 'todo');
});

test('validateStatus rejects unsupported values', () => {
  assert.throws(() => validateStatus('blocked'), {
    name: 'TypeError',
    message: 'Invalid input: status must be one of todo, in-progress, done.'
  });
});

test('validatePriority returns default value when undefined', () => {
  const result = validatePriority(undefined);
  assert.equal(result, 'medium');
});

test('validatePriority rejects unsupported values', () => {
  assert.throws(() => validatePriority('urgent'), {
    name: 'TypeError',
    message: 'Invalid input: priority must be one of low, medium, high.'
  });
});

test('validateCategory returns default value when undefined', () => {
  const result = validateCategory(undefined);
  assert.equal(result, 'general');
});

test('validateCategory trims surrounding whitespace', () => {
  const result = validateCategory('  work  ');
  assert.equal(result, 'work');
});

test('validateCategory rejects empty values', () => {
  assert.throws(() => validateCategory('   '), {
    name: 'TypeError',
    message: 'Invalid input: category cannot be empty.'
  });
});

test('validateTaskInput applies defaults for optional fields', () => {
  const result = validateTaskInput({ title: 'Write docs' });
  assert.deepEqual(result, {
    title: 'Write docs',
    description: '',
    status: 'todo',
    priority: 'medium',
    category: 'general'
  });
});

test('validateTaskInput rejects non-object payloads', () => {
  assert.throws(() => validateTaskInput(null), {
    name: 'TypeError',
    message: 'Invalid input: task input must be a plain object.'
  });
});

test('validateTaskUpdateInput keeps only allowed update fields', () => {
  const result = validateTaskUpdateInput({
    title: '  New title  ',
    extra: 'ignored'
  });
  assert.deepEqual(result, {
    title: 'New title'
  });
});

test('validateTaskUpdateInput accepts category updates', () => {
  const result = validateTaskUpdateInput({
    category: '  personal  '
  });

  assert.deepEqual(result, {
    category: 'personal'
  });
});

test('validateListOptions rejects empty category values', () => {
  assert.throws(() => validateListOptions({ category: '   ' }), {
    name: 'TypeError',
    message: 'Invalid input: category cannot be empty.'
  });
});

test('validateTaskUpdateInput rejects empty update payload', () => {
  assert.throws(() => validateTaskUpdateInput({}), {
    name: 'TypeError',
    message: 'Invalid input: at least one updatable field is required.'
  });
});

test('validateListOptions returns default sort options', () => {
  const result = validateListOptions({});
  assert.deepEqual(result, {
    sortBy: 'createdAt',
    order: 'asc'
  });
});

test('validateListOptions validates and forwards filter fields', () => {
  const result = validateListOptions({
    status: 'in-progress',
    priority: 'high',
    category: 'work',
    sortBy: 'priority',
    order: 'desc'
  });

  assert.deepEqual(result, {
    status: 'in-progress',
    priority: 'high',
    category: 'work',
    sortBy: 'priority',
    order: 'desc'
  });
});

test('validateListOptions rejects invalid sortBy values', () => {
  assert.throws(() => validateListOptions({ sortBy: 'title' }), {
    name: 'TypeError',
    message: 'Invalid input: sortBy must be createdAt or priority.'
  });
});
