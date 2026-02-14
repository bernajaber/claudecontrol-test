import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load, save } from '../src/storage.js';

vi.mock('node:fs');
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
    it('returns [] when file does not exist', async () => {
      const fs = await import('node:fs');
      fs.default.readFileSync.mockImplementation(() => {
        const error = new Error('ENOENT');
        error.code = 'ENOENT';
        throw error;
      });

      const result = load();
      expect(result).toEqual([]);
    });

    it('returns parsed data when file exists', async () => {
      const fs = await import('node:fs');
      const testData = [{ id: 1, text: 'Test task', done: false }];
      fs.default.readFileSync.mockReturnValue(JSON.stringify(testData));

      const result = load();
      expect(result).toEqual(testData);
    });

    it('returns [] when file contains malformed JSON', async () => {
      const fs = await import('node:fs');
      fs.default.readFileSync.mockReturnValue('{invalid json}');

      const result = load();
      expect(result).toEqual([]);
    });
  });

  describe('save', () => {
    it('writes formatted JSON', async () => {
      const fs = await import('node:fs');
      fs.default.mkdirSync.mockImplementation(() => {});
      fs.default.writeFileSync.mockImplementation(() => {});
      fs.default.renameSync.mockImplementation(() => {});

      const tasks = [{ id: 1, text: 'Test', done: false }];
      save(tasks);

      expect(fs.default.writeFileSync).toHaveBeenCalledWith(
        '/home/user/.todo.json.tmp',
        JSON.stringify(tasks, null, 2),
        'utf8'
      );
      expect(fs.default.renameSync).toHaveBeenCalledWith(
        '/home/user/.todo.json.tmp',
        '/home/user/.todo.json'
      );
    });

    it('creates parent directory if needed', async () => {
      const fs = await import('node:fs');
      fs.default.mkdirSync.mockImplementation(() => {});
      fs.default.writeFileSync.mockImplementation(() => {});
      fs.default.renameSync.mockImplementation(() => {});

      save([]);

      expect(fs.default.mkdirSync).toHaveBeenCalledWith('/home/user', { recursive: true });
    });
  });
});
