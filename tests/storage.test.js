import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load, save } from '../src/storage.js';

vi.mock('node:fs/promises');
vi.mock('node:os', () => ({
  default: {
    homedir: () => '/home/user'
  }
}));

describe('storage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('load', () => {
    it('returns [] when file does not exist (ENOENT)', async () => {
      const fs = await import('node:fs/promises');
      const error = new Error('ENOENT');
      error.code = 'ENOENT';
      fs.default.readFile.mockRejectedValue(error);

      const result = await load();
      expect(result).toEqual([]);
    });

    it('returns parsed array when file exists', async () => {
      const fs = await import('node:fs/promises');
      const testData = [{ id: 1, text: 'Test task', done: false }];
      fs.default.readFile.mockResolvedValue(JSON.stringify(testData));

      const result = await load();
      expect(result).toEqual(testData);
    });

    it('writes JSON formatted with correct indentation', async () => {
      const fs = await import('node:fs/promises');
      fs.default.writeFile.mockResolvedValue();

      const tasks = [{ id: 1, text: 'Test', done: false }];
      await save(tasks);

      expect(fs.default.writeFile).toHaveBeenCalledWith(
        '/home/user/.todo.json',
        JSON.stringify(tasks, null, 2),
        'utf8'
      );
    });

    it('re-throws errors that are not ENOENT', async () => {
      const fs = await import('node:fs/promises');
      const error = new Error('EPERM');
      error.code = 'EPERM';
      fs.default.readFile.mockRejectedValue(error);

      await expect(load()).rejects.toThrow('EPERM');
    });
  });

  describe('save', () => {
    it('writes JSON formatted with correct indentation', async () => {
      const fs = await import('node:fs/promises');
      fs.default.writeFile.mockResolvedValue();

      const tasks = [{ id: 1, text: 'Test', done: false }];
      await save(tasks);

      expect(fs.default.writeFile).toHaveBeenCalledWith(
        '/home/user/.todo.json',
        JSON.stringify(tasks, null, 2),
        'utf8'
      );
    });
  });
});
