import { describe, it, expect, beforeEach, vi } from 'vitest';
import { add, list } from '../src/todo.js';
import * as storage from '../src/storage.js';

vi.mock('../src/storage.js');

describe('TODO CLI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storage.load.mockReturnValue([]);
  });

  describe('add()', () => {
    it('deve adicionar uma tarefa com sucesso', () => {
      const taskText = 'Comprar leite';
      const result = add(taskText);

      expect(result).toEqual({
        id: 1,
        text: 'Comprar leite',
        completed: false,
        createdAt: expect.any(String)
      });
      expect(storage.save).toHaveBeenCalledWith([result]);
    });

    it('deve gerar IDs incrementais', () => {
      storage.load.mockReturnValue([
        { id: 1, text: 'Tarefa 1', completed: false }
      ]);

      const result = add('Tarefa 2');

      expect(result.id).toBe(2);
    });

    it('deve remover espacos em branco da tarefa', () => {
      const result = add('  Tarefa com espacos  ');

      expect(result.text).toBe('Tarefa com espacos');
    });

    it('deve lancar erro se texto vazio', () => {
      expect(() => add('')).toThrow('Task text cannot be empty');
      expect(() => add('   ')).toThrow('Task text cannot be empty');
    });

    it('deve lancar erro se nao for string', () => {
      expect(() => add(null)).toThrow('Task text cannot be empty');
      expect(() => add(undefined)).toThrow('Task text cannot be empty');
      expect(() => add(123)).toThrow('Task text cannot be empty');
    });
  });

  describe('list()', () => {
    it('deve retornar lista vazia quando nao ha tarefas', () => {
      storage.load.mockReturnValue([]);

      const result = list();

      expect(result).toEqual([]);
    });

    it('deve retornar todas as tarefas', () => {
      const tasks = [
        { id: 1, text: 'Tarefa 1', completed: false },
        { id: 2, text: 'Tarefa 2', completed: true }
      ];
      storage.load.mockReturnValue(tasks);

      const result = list();

      expect(result).toEqual(tasks);
    });
  });
});
