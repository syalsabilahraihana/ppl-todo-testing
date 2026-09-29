import { describe, it, expect, beforeEach } from 'vitest';
import { addTodo, getAllTodos, toggleTodo, deleteTodo, resetTodos } from '../../src/app';

describe('Todo Unit Tests', () => {
  // Reset data sebelum tiap test, biar test satu sama lain nggak saling ganggu
  beforeEach(() => {
    resetTodos();
  });

  it('should add a new todo', () => {
    const todo = addTodo('Belajar PPL');
    expect(todo.title).toBe('Belajar PPL');
    expect(todo.completed).toBe(false);
  });

  it('should throw error when adding empty todo', () => {
    expect(() => addTodo('')).toThrow('Title tidak boleh kosong');
  });

  it('should get all todos', () => {
    addTodo('Todo 1');
    addTodo('Todo 2');
    const todos = getAllTodos();
    expect(todos.length).toBe(2);
  });

  it('should toggle todo completed status', () => {
    const todo = addTodo('Belajar Vitest');
    const toggled = toggleTodo(todo.id);
    expect(toggled?.completed).toBe(true);
  });

  it('should delete a todo', () => {
    const todo = addTodo('Hapus saya');
    const result = deleteTodo(todo.id);
    expect(result).toBe(true);
    expect(getAllTodos().length).toBe(0);
  });

  it('should return false when deleting non-existent todo', () => {
    const result = deleteTodo(999);
    expect(result).toBe(false);
  });
});