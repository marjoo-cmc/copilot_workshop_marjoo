const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

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
    return `${GREEN}${normalizedStatus}${RESET}`;
  }

  if (normalizedStatus === 'in-progress') {
    return `${YELLOW}${normalizedStatus}${RESET}`;
  }

  if (normalizedStatus === 'todo') {
    return `${RED}${normalizedStatus}${RESET}`;
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
    return `${BOLD}${RED}${normalizedPriority}${RESET}`;
  }

  if (normalizedPriority === 'medium') {
    return `${BOLD}${YELLOW}${normalizedPriority}${RESET}`;
  }

  if (normalizedPriority === 'low') {
    return `${DIM}${normalizedPriority}${RESET}`;
  }

  throw new TypeError('Invalid input: priority must be one of low, medium, high.');
}
