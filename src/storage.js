import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const TODO_FILE = path.join(os.homedir(), '.todo.json');

export function load() {
  try {
    const content = fs.readFileSync(TODO_FILE, 'utf8');
    try {
      return JSON.parse(content);
    } catch (parseError) {
      return [];
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export function save(tasks) {
  const dir = path.dirname(TODO_FILE);
  fs.mkdirSync(dir, { recursive: true });

  const tempFile = `${TODO_FILE}.tmp`;
  const content = JSON.stringify(tasks, null, 2);

  fs.writeFileSync(tempFile, content, 'utf8');
  try {
    fs.renameSync(tempFile, TODO_FILE);
  } catch (error) {
    try {
      fs.unlinkSync(tempFile);
    } catch {
      // Ignore ENOENT if temp file doesn't exist
    }
    throw error;
  }
}
