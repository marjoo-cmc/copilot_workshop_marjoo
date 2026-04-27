import { createTaskService } from './services/taskService.js';

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
  console.log(taskOne);
  console.log(taskTwo);
  console.log(taskThree);

  console.log('--- List all tasks ---');
  console.log(taskService.listTasks());

  console.log('--- Update a task ---');
  const updatedTask = taskService.updateTask(taskTwo.id, {
    status: 'done',
    description: 'Script reviewed and approved'
  });
  console.log(updatedTask);

  console.log('--- Filter by status and priority ---');
  const filteredTasks = taskService.listTasks({
    status: 'todo',
    priority: 'high'
  });
  console.log(filteredTasks);

  console.log('--- Sort by priority descending ---');
  const sortedByPriority = taskService.listTasks({
    sortBy: 'priority',
    order: 'desc'
  });
  console.log(sortedByPriority);

  console.log('--- Delete a task ---');
  const deletedTask = taskService.deleteTask(taskThree.id);
  console.log(deletedTask);

  console.log('--- Final list ---');
  console.log(taskService.listTasks({ sortBy: 'createdAt', order: 'asc' }));
}

try {
  runDemo();
} catch (error) {
  console.error('Task Manager demo failed:', error.message);
  process.exitCode = 1;
}
