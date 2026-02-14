import { load, save } from './storage.js';

export function add(taskText) {
  if (!taskText || typeof taskText !== 'string' || taskText.trim() === '') {
    throw new Error('Task text cannot be empty');
  }

  const tasks = load();
  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    text: taskText.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  save(tasks);
  return newTask;
}

export function list() {
  return load();
}
