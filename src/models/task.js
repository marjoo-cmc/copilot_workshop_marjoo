import { randomUUID } from 'node:crypto';
import {
  validateCategory,
  validateDescription,
  validatePriority,
  validateStatus,
  validateTaskInput,
  validateTaskUpdateInput,
  validateTitle
} from '../utils/validators.js';

/**
 * Represents a task entity with input validation and serialization support.
 */
export class Task {
  /**
   * Creates a Task instance.
   * @param {object} input Task input values.
   * @param {string} [input.id] Optional task id.
   * @param {string} input.title Task title.
   * @param {string} [input.description] Task description.
   * @param {'todo'|'in-progress'|'done'} [input.status] Task status.
   * @param {'low'|'medium'|'high'} [input.priority] Task priority.
  * @param {string} [input.category] Task category.
   * @param {string} [input.createdAt] Optional ISO timestamp.
   * @param {string} [input.updatedAt] Optional ISO timestamp.
   */
  constructor(input) {
    const normalizedInput = validateTaskInput(input);

    this.id = validateId(input.id);
    this.title = normalizedInput.title;
    this.description = normalizedInput.description;
    this.status = normalizedInput.status;
    this.priority = normalizedInput.priority;
    this.category = normalizedInput.category;
    this.createdAt = validateTimestamp(input.createdAt, 'createdAt') ?? new Date().toISOString();
    this.updatedAt = validateTimestamp(input.updatedAt, 'updatedAt') ?? this.createdAt;
  }

  /**
   * Updates mutable task fields and refreshes updatedAt.
   * @param {object} updates Task field updates.
   * @returns {Task} The updated task instance.
   */
  update(updates) {
    const normalizedUpdates = validateTaskUpdateInput(updates);

    if (Object.prototype.hasOwnProperty.call(normalizedUpdates, 'title')) {
      this.title = validateTitle(normalizedUpdates.title);
    }

    if (Object.prototype.hasOwnProperty.call(normalizedUpdates, 'description')) {
      this.description = validateDescription(normalizedUpdates.description);
    }

    if (Object.prototype.hasOwnProperty.call(normalizedUpdates, 'status')) {
      this.status = validateStatus(normalizedUpdates.status);
    }

    if (Object.prototype.hasOwnProperty.call(normalizedUpdates, 'priority')) {
      this.priority = validatePriority(normalizedUpdates.priority);
    }

    if (Object.prototype.hasOwnProperty.call(normalizedUpdates, 'category')) {
      this.category = validateCategory(normalizedUpdates.category);
    }

    this.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Converts the task instance into a plain object.
   * @returns {{
   * id: string,
   * title: string,
   * description: string,
   * status: 'todo'|'in-progress'|'done',
   * priority: 'low'|'medium'|'high',
  * category: string,
   * createdAt: string,
   * updatedAt: string
   * }} JSON-safe task object.
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      category: this.category,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

function validateId(id) {
  if (typeof id === 'undefined') {
    return randomUUID();
  }

  if (typeof id !== 'string' || !id.trim()) {
    throw new TypeError('Invalid input: id must be a non-empty string.');
  }

  return id.trim();
}

function validateTimestamp(timestamp, fieldName) {
  if (typeof timestamp === 'undefined') {
    return undefined;
  }

  if (typeof timestamp !== 'string') {
    throw new TypeError(`Invalid input: ${fieldName} must be an ISO timestamp string.`);
  }

  const parsedTimestamp = Date.parse(timestamp);
  if (Number.isNaN(parsedTimestamp)) {
    throw new TypeError(`Invalid input: ${fieldName} must be a valid ISO timestamp.`);
  }

  return new Date(parsedTimestamp).toISOString();
}
