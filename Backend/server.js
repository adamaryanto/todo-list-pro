import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 5000;
const SECRET = 'rahasia123';

// DB Connection
const db = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todolist_db'
});

// Middleware
app.use(cors());
app.use(express.json());

// JWT Auth Middleware
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token tidak ada atau salah format' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

// REGISTER
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
    res.json({ message: 'Register berhasil' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal register' });
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const [[user]] = await db.query('SELECT * FROM users WHERE name = ?', [name]);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Name atau password salah' });

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login gagal' });
  }
});

// GET CURRENT USER
app.get('/api/me', auth, async (req, res) => {
  const [[user]] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
  res.json(user);
});

// CREATE TODO
app.post('/api/todos', auth, async (req, res) => {
  const { title, description, due_date } = req.body;
  await db.query(
    'INSERT INTO tasks (user_id, title, description, due_date) VALUES (?, ?, ?, ?)',
    [req.user.id, title, description, due_date]
  );
  res.json({ message: 'Todo ditambahkan' });
});

// GET TODOS
app.get('/api/tasks', auth, async (req, res) => {
  try {
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(tasks);
  } catch (err) {
    console.error('Error saat mengambil tasks:', err);
    res.status(500).json({ message: 'Gagal mengambil task' });
  }
});


// UPDATE TODO
app.put('/api/tasks/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Pastikan user hanya bisa update task miliknya
    const [taskRows] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (taskRows.length === 0) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }

    // Update status menjadi completed
    await db.query('UPDATE tasks SET status = "completed" WHERE id = ?', [id]);

    res.json({ message: 'Task berhasil diselesaikan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menyelesaikan task' });
  }
});



// DELETE TODO
app.delete('/api/tasks/:id', auth, async (req, res) => {
  const taskId = req.params.id;
  try {
    const [result] = await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, req.user.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task tidak ditemukan atau bukan milik kamu' });
    }

    res.json({ message: 'Task berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus task' });
  }
});


// START
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
});
