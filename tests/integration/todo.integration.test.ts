import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app, { resetTodos } from '../../src/app';

describe('Todo API Integration Tests', () => {
  beforeEach(() => {
    resetTodos();
  });

  it('GET /todos should return empty array initially', async () => {
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /todos should create a new todo', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: 'Belajar Integration Testing' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Belajar Integration Testing');
    expect(res.body.completed).toBe(false);
  });

  it('POST /todos should return 400 for empty title', async () => {
    const res = await request(app).post('/todos').send({ title: '' });
    expect(res.status).toBe(400);
  });

  it('PATCH /todos/:id should toggle completed status', async () => {
    const created = await request(app).post('/todos').send({ title: 'Toggle me' });
    const res = await request(app).patch(`/todos/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('DELETE /todos/:id should remove a todo', async () => {
    const created = await request(app).post('/todos').send({ title: 'Delete me' });
    const res = await request(app).delete(`/todos/${created.body.id}`);

    expect(res.status).toBe(204);

    const getRes = await request(app).get('/todos');
    expect(getRes.body.length).toBe(0);
  });

  it('DELETE /todos/:id should return 404 for non-existent todo', async () => {
    const res = await request(app).delete('/todos/999');
    expect(res.status).toBe(404);
  });
});