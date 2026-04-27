const STATUS_VALUES = ['todo', 'in-progress', 'done'];
const PRIORITY_VALUES = ['low', 'medium', 'high'];
const DEFAULT_CATEGORY = 'general';

/**
 * Validates and normalizes a task title.
 * @param {unknown} title The incoming task title value.
 * @returns {string} Trimmed title.
 * @throws {TypeError} When title is not a non-empty string.
 * @example
 * validateTitle('  Write tests  ');
 * // => 'Write tests'
 * @example
 * validateTitle('Buy milk');
 * // => 'Buy milk'
 */
export function validateTitle(title) {
  if (typeof title !== 'string') {
    throw new TypeError('Invalid input: title must be a string.');
  }

  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    throw new TypeError('Invalid input: title cannot be empty.');
  }

  if (normalizedTitle.length > 200) {
    throw new TypeError('Invalid input: title must be 200 characters or fewer.');
  }

  return normalizedTitle;
}

/**
 * Validates and normalizes a task description.
 * @param {unknown} description The incoming task description value.
 * @returns {string} Trimmed description.
 * @throws {TypeError} When description is not a string.
 * @example
 * validateDescription(undefined);
 * // => ''
 * @example
 * validateDescription('  Call the team  ');
 * // => 'Call the team'
 */
export function validateDescription(description) {
  if (typeof description === 'undefined') {
    return '';
  }

  if (typeof description !== 'string') {
    throw new TypeError('Invalid input: description must be a string.');
  }

  return description.trim();
}

/**
 * Validates a task status value.
 * @param {unknown} status The incoming status value.
 * @returns {'todo'|'in-progress'|'done'} Valid status value.
 * @throws {TypeError} When status is not allowed.
 * @example
 * validateStatus('todo');
 * // => 'todo'
 * @example
 * validateStatus('done');
 * // => 'done'
 */
export function validateStatus(status) {
  if (typeof status === 'undefined') {
    return 'todo';
  }

  if (typeof status !== 'string') {
    throw new TypeError('Invalid input: status must be a string.');
  }

  const normalizedStatus = status.trim();
  if (!STATUS_VALUES.includes(normalizedStatus)) {
    throw new TypeError('Invalid input: status must be one of todo, in-progress, done.');
  }

  return normalizedStatus;
}

/**
 * Validates a task priority value.
 * @param {unknown} priority The incoming priority value.
 * @returns {'low'|'medium'|'high'} Valid priority value.
 * @throws {TypeError} When priority is not allowed.
 * @example
 * validatePriority('low');
 * // => 'low'
 * @example
 * validatePriority('high');
 * // => 'high'
 */
export function validatePriority(priority) {
  if (typeof priority === 'undefined') {
    return 'medium';
  }

  if (typeof priority !== 'string') {
    throw new TypeError('Invalid input: priority must be a string.');
  }

  const normalizedPriority = priority.trim();
  if (!PRIORITY_VALUES.includes(normalizedPriority)) {
    throw new TypeError('Invalid input: priority must be one of low, medium, high.');
  }

  return normalizedPriority;
}

/**
 * Validates a task category value.
 * @param {unknown} category The incoming category value.
 * @returns {string} Valid category value.
 * @throws {TypeError} When category is not a non-empty string.
 * @example
 * validateCategory(undefined);
 * // => 'general'
 * @example
 * validateCategory('  work  ');
 * // => 'work'
 */
export function validateCategory(category) {
  if (typeof category === 'undefined') {
    return DEFAULT_CATEGORY;
  }

  if (typeof category !== 'string') {
    throw new TypeError('Invalid input: category must be a string.');
  }

  const normalizedCategory = category.trim();
  if (!normalizedCategory) {
    throw new TypeError('Invalid input: category cannot be empty.');
  }

  return normalizedCategory;
}

/**
 * Validates and normalizes task creation input.
 * @param {unknown} input Raw task payload.
 * @returns {{ title: string, description: string, status: 'todo'|'in-progress'|'done', priority: 'low'|'medium'|'high', category: string }} Normalized task data.
 * @throws {TypeError} When input is malformed.
 * @example
 * validateTaskInput({ title: 'Plan sprint' });
 * // => { title: 'Plan sprint', description: '', status: 'todo', priority: 'medium' }
 * @example
 * validateTaskInput({ title: 'Fix bug', status: 'in-progress', priority: 'high' });
 * // => { title: 'Fix bug', description: '', status: 'in-progress', priority: 'high' }
 */
export function validateTaskInput(input) {
  assertPlainObject(input, 'task input');

  return {
    title: validateTitle(input.title),
    description: validateDescription(input.description),
    status: validateStatus(input.status),
    priority: validatePriority(input.priority),
    category: validateCategory(input.category)
  };
}

/**
 * Validates and normalizes task update input.
 * @param {unknown} updates Fields to update.
 * @returns {{ title?: string, description?: string, status?: 'todo'|'in-progress'|'done', priority?: 'low'|'medium'|'high', category?: string }} Normalized update patch.
 * @throws {TypeError} When updates are malformed or empty.
 * @example
 * validateTaskUpdateInput({ title: 'Refine plan' });
 * // => { title: 'Refine plan' }
 * @example
 * validateTaskUpdateInput({ status: 'done', priority: 'low' });
 * // => { status: 'done', priority: 'low' }
 */
export function validateTaskUpdateInput(updates) {
  assertPlainObject(updates, 'task updates');

  const patch = {};

  if (Object.prototype.hasOwnProperty.call(updates, 'title')) {
    patch.title = validateTitle(updates.title);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'description')) {
    patch.description = validateDescription(updates.description);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'status')) {
    patch.status = validateStatus(updates.status);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'priority')) {
    patch.priority = validatePriority(updates.priority);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'category')) {
    patch.category = validateCategory(updates.category);
  }

  if (Object.keys(patch).length === 0) {
    throw new TypeError('Invalid input: at least one updatable field is required.');
  }

  return patch;
}

/**
 * Validates and normalizes task list options.
 * @param {unknown} options Filtering and sorting options.
 * @returns {{ status?: 'todo'|'in-progress'|'done', priority?: 'low'|'medium'|'high', category?: string, sortBy: 'createdAt'|'priority', order: 'asc'|'desc' }} Normalized list options.
 * @throws {TypeError} When options are malformed.
 * @example
 * validateListOptions({ status: 'todo', sortBy: 'priority', order: 'desc' });
 * // => { status: 'todo', sortBy: 'priority', order: 'desc' }
 * @example
 * validateListOptions({});
 * // => { sortBy: 'createdAt', order: 'asc' }
 */
export function validateListOptions(options) {
  const normalizedOptions = typeof options === 'undefined' ? {} : options;
  assertPlainObject(normalizedOptions, 'list options');

  const result = {
    sortBy: 'createdAt',
    order: 'asc'
  };

  if (Object.prototype.hasOwnProperty.call(normalizedOptions, 'status')) {
    result.status = validateStatus(normalizedOptions.status);
  }

  if (Object.prototype.hasOwnProperty.call(normalizedOptions, 'priority')) {
    result.priority = validatePriority(normalizedOptions.priority);
  }

  if (Object.prototype.hasOwnProperty.call(normalizedOptions, 'category')) {
    result.category = validateCategory(normalizedOptions.category);
  }

  if (Object.prototype.hasOwnProperty.call(normalizedOptions, 'sortBy')) {
    result.sortBy = validateSortBy(normalizedOptions.sortBy);
  }

  if (Object.prototype.hasOwnProperty.call(normalizedOptions, 'order')) {
    result.order = validateOrder(normalizedOptions.order);
  }

  return result;
}

function assertPlainObject(value, label) {
  const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
  if (!isObject) {
    throw new TypeError(`Invalid input: ${label} must be a plain object.`);
  }
}

function validateSortBy(sortBy) {
  if (typeof sortBy !== 'string') {
    throw new TypeError('Invalid input: sortBy must be a string.');
  }

  const normalizedSortBy = sortBy.trim();
  if (normalizedSortBy !== 'createdAt' && normalizedSortBy !== 'priority') {
    throw new TypeError('Invalid input: sortBy must be createdAt or priority.');
  }

  return normalizedSortBy;
}

function validateOrder(order) {
  if (typeof order !== 'string') {
    throw new TypeError('Invalid input: order must be a string.');
  }

  const normalizedOrder = order.trim();
  if (normalizedOrder !== 'asc' && normalizedOrder !== 'desc') {
    throw new TypeError('Invalid input: order must be asc or desc.');
  }

  return normalizedOrder;
}
