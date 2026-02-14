import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const TODO_FILE = path.join(os.homedir(), '.todo.json');

export async function load() {
  try {
    const content = await fs.readFile(TODO_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function save(tasks) {
  await fs.writeFile(TODO_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}
