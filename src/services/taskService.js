import { Task } from '../models/task.js';
import {
  validateListOptions,
  validateTaskInput,
  validateTaskUpdateInput
} from '../utils/validators.js';

const PRIORITY_RANK = {
  high: 3,
  medium: 2,
  low: 1
};

/**
 * Creates a task service instance with CRUD, filtering, and sorting operations.
 * @returns {{
 * createTask: (input: object) => object,
 * listTasks: (options?: object) => object[],
 * updateTask: (id: string, updates: object) => object,
 * deleteTask: (id: string) => object
 * }} Service API.
 */
export function createTaskService() {
  const tasks = [];

  function createTask(input) {
    const normalizedInput = validateTaskInput(input);
    const task = new Task(normalizedInput);
    tasks.push(task);
    return task.toJSON();
  }

  function listTasks(options = {}) {
    const normalizedOptions = validateListOptions(options);
    const filteredTasks = filterTasks(tasks, normalizedOptions);
    const sortedTasks = sortTasks(filteredTasks, normalizedOptions);
    return sortedTasks.map((task) => task.toJSON());
  }

  function updateTask(id, updates) {
    const normalizedId = validateTaskId(id);
    const normalizedUpdates = validateTaskUpdateInput(updates);
    const task = findTaskById(tasks, normalizedId);

    if (!task) {
      throw new Error(`Task not found: ${normalizedId}`);
    }

    task.update(normalizedUpdates);
    return task.toJSON();
  }

  function deleteTask(id) {
    const normalizedId = validateTaskId(id);
    const taskIndex = tasks.findIndex((task) => task.id === normalizedId);

    if (taskIndex === -1) {
      throw new Error(`Task not found: ${normalizedId}`);
    }

    const [deletedTask] = tasks.splice(taskIndex, 1);
    return deletedTask.toJSON();
  }

  return {
    createTask,
    listTasks,
    updateTask,
    deleteTask
  };
}

function validateTaskId(id) {
  if (typeof id !== 'string' || !id.trim()) {
    throw new TypeError('Invalid input: id must be a non-empty string.');
  }

  return id.trim();
}

function findTaskById(tasks, id) {
  return tasks.find((task) => task.id === id);
}

function filterTasks(tasks, options) {
  return tasks.filter((task) => {
    const statusMatches = !options.status || task.status === options.status;
    const priorityMatches = !options.priority || task.priority === options.priority;
    return statusMatches && priorityMatches;
  });
}

function sortTasks(tasks, options) {
  const sortedTasks = [...tasks];

  sortedTasks.sort((firstTask, secondTask) => {
    const comparison =
      options.sortBy === 'priority'
        ? PRIORITY_RANK[firstTask.priority] - PRIORITY_RANK[secondTask.priority]
        : Date.parse(firstTask.createdAt) - Date.parse(secondTask.createdAt);

    return options.order === 'desc' ? comparison * -1 : comparison;
  });

  return sortedTasks;
}
