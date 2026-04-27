import chalk from 'chalk';

/**
 * Colors a task status string according to CLI status rules.
 * @param {unknown} status The status value to colorize.
 * @returns {string} Colorized status text.
 * @throws {TypeError} When status is not a string or is unsupported.
 * @example
 * colorStatus('done');
 * // => green text for "done"
 * @example
 * colorStatus('todo');
 * // => red text for "todo"
 */
export function colorStatus(status) {
  if (typeof status !== 'string') {
    throw new TypeError('Invalid input: status must be a string.');
  }

  const normalizedStatus = status.trim();
  if (normalizedStatus === 'done') {
    return chalk.green(normalizedStatus);
  }

  if (normalizedStatus === 'in-progress') {
    return chalk.yellow(normalizedStatus);
  }

  if (normalizedStatus === 'todo') {
    return chalk.red(normalizedStatus);
  }

  throw new TypeError('Invalid input: status must be one of todo, in-progress, done.');
}

/**
 * Colors a task priority string according to CLI priority rules.
 * @param {unknown} priority The priority value to colorize.
 * @returns {string} Colorized priority text.
 * @throws {TypeError} When priority is not a string or is unsupported.
 * @example
 * colorPriority('high');
 * // => bold red text for "high"
 * @example
 * colorPriority('low');
 * // => dim text for "low"
 */
export function colorPriority(priority) {
  if (typeof priority !== 'string') {
    throw new TypeError('Invalid input: priority must be a string.');
  }

  const normalizedPriority = priority.trim();
  if (normalizedPriority === 'high') {
    return chalk.bold.red(normalizedPriority);
  }

  if (normalizedPriority === 'medium') {
    return chalk.bold.yellow(normalizedPriority);
  }

  if (normalizedPriority === 'low') {
    return chalk.dim(normalizedPriority);
  }

  throw new TypeError('Invalid input: priority must be one of low, medium, high.');
}
