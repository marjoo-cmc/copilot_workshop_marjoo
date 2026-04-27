import { createTaskService } from './services/taskService.js';
import { colorPriority, colorStatus } from './utils/colors.js';

function printTask(task) {
  console.log(`ID: ${task.id}`);
  console.log(`Title: ${task.title}`);
  console.log(`Description: ${task.description}`);
  console.log(`Status: ${colorStatus(task.status)}`);
  console.log(`Priority: ${colorPriority(task.priority)}`);
  console.log(`Created: ${task.createdAt}`);
  console.log(`Updated: ${task.updatedAt}`);
  console.log('');
}

function printTaskList(tasks) {
  if (tasks.length === 0) {
    console.log('(no tasks)');
    console.log('');
    return;
  }

  tasks.forEach((task) => {
    printTask(task);
  });
}

function runDemo() {
  const taskService = createTaskService();

  console.log('--- Create tasks ---');
  const taskOne = taskService.createTask({
    title: 'Write project brief',
    description: 'Draft requirements for Task Manager',
    priority: 'high'
  });
  const taskTwo = taskService.createTask({
    title: 'Prepare demo script',
    status: 'in-progress',
    priority: 'medium'
  });
  const taskThree = taskService.createTask({
    title: 'Refactor CLI help output',
    priority: 'low'
  });
  printTask(taskOne);
  printTask(taskTwo);
  printTask(taskThree);

  console.log('--- List all tasks ---');
  printTaskList(taskService.listTasks());

  console.log('--- Update a task ---');
  const updatedTask = taskService.updateTask(taskTwo.id, {
    status: 'done',
    description: 'Script reviewed and approved'
  });
  printTask(updatedTask);

  console.log('--- Filter by status and priority ---');
  const filteredTasks = taskService.listTasks({
    status: 'todo',
    priority: 'high'
  });
  printTaskList(filteredTasks);

  console.log('--- Sort by priority descending ---');
  const sortedByPriority = taskService.listTasks({
    sortBy: 'priority',
    order: 'desc'
  });
  printTaskList(sortedByPriority);

  console.log('--- Delete a task ---');
  const deletedTask = taskService.deleteTask(taskThree.id);
  printTask(deletedTask);

  console.log('--- Final list ---');
  printTaskList(taskService.listTasks({ sortBy: 'createdAt', order: 'asc' }));
}

try {
  runDemo();
} catch (error) {
  console.error('Task Manager demo failed:', error.message);
  process.exitCode = 1;
}
