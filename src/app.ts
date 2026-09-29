import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [];
let nextId = 1;

// Fungsi murni (gampang di-unit test)
export function addTodo(title: string): Todo {
  if (!title || title.trim() === '') {
    throw new Error('Title tidak boleh kosong');
  }
  const todo: Todo = { id: nextId++, title, completed: false };
  todos.push(todo);
  return todo;
}

export function getAllTodos(): Todo[] {
  return todos;
}

export function toggleTodo(id: number): Todo | undefined {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
  return todo;
}

export function deleteTodo(id: number): boolean {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}

export function resetTodos(): void {
  todos = [];
  nextId = 1;
}

// Routes (buat integration test & dipakai frontend)
app.get('/todos', (req: Request, res: Response) => {
  res.json(getAllTodos());
});

app.post('/todos', (req: Request, res: Response) => {
  try {
    const todo = addTodo(req.body.title);
    res.status(201).json(todo);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/todos/:id', (req: Request, res: Response) => {
  const todo = toggleTodo(Number(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo tidak ditemukan' });
  res.json(todo);
});

app.delete('/todos/:id', (req: Request, res: Response) => {
  const success = deleteTodo(Number(req.params.id));
  if (!success) return res.status(404).json({ error: 'Todo tidak ditemukan' });
  res.status(204).send();
});

// Sajikan halaman UI sederhana
app.get('/', (req: Request, res: Response) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Todo List</title>
</head>
<body>
  <h1>Todo List</h1>
  <input id="todoInput" type="text" placeholder="Tulis todo..." />
  <button id="addBtn">Tambah</button>
  <ul id="todoList"></ul>

  <script>
    async function loadTodos() {
      const res = await fetch('/todos');
      const todos = await res.json();
      const list = document.getElementById('todoList');
      list.innerHTML = '';
      todos.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t.title + (t.completed ? ' (selesai)' : '');
        li.dataset.id = t.id;
        list.appendChild(li);
      });
    }

    document.getElementById('addBtn').addEventListener('click', async () => {
      const input = document.getElementById('todoInput');
      await fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.value })
      });
      input.value = '';
      loadTodos();
    });

    loadTodos();
  </script>
</body>
</html>
  `);
});

export default app;