import express from 'express';
import { createServer as createViteServer } from 'vite';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

// Set timezone to Philippines
process.env.TZ = 'Asia/Manila';

const { Pool } = pg;

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'quickoffice-secret-key';

// PostgreSQL Connection
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
console.log('Database connection attempt...');
if (!connectionString) {
  console.error('CRITICAL: No database connection string found in environment variables (DATABASE_URL, POSTGRES_URL, etc.)');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// Database Initialization
const initDb = async () => {
  try {
    await pool.query("SET TIME ZONE 'Asia/Manila'");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL NOT NULL,
        fullname VARCHAR(100) NULL,
        email VARCHAR(100) NULL,
        password VARCHAR(255) NULL,
        role VARCHAR(20) NULL DEFAULT 'student',
        joined_date TIMESTAMP WITHOUT TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT users_pkey PRIMARY KEY (id),
        CONSTRAINT users_email_key UNIQUE (email)
      );
    `);

    // Migration: Rename 'name' to 'fullname' if it exists
    try {
      await pool.query(`
        DO $$ 
        BEGIN 
          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='name') THEN
            ALTER TABLE users RENAME COLUMN name TO fullname;
          END IF;
        END $$;
      `);
    } catch (migrationErr) {
      console.log('Migration (rename name to fullname) skipped or already done');
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS stats (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        xp INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0,
        completed_lessons TEXT[],
        current_tool VARCHAR(50),
        last_completion_date DATE,
        PRIMARY KEY (user_id)
      );

      CREATE TABLE IF NOT EXISTS tutorials (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        tool VARCHAR(50),
        video_url TEXT,
        points TEXT[],
        pro_tip TEXT,
        description TEXT,
        created_by INTEGER REFERENCES users(id)
      );
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

const seedDb = async () => {
  try {
    // Seed Admin User
    const checkAdmin = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@quickoffice.com']);
    if (checkAdmin.rows.length === 0) {
      console.log('Seeding admin user...');
      const adminPassword = await bcrypt.hash('adminpassword123', 10);
      await pool.query(
        "INSERT INTO users (fullname, email, password, role) VALUES ($1, $2, $3, $4)",
        ['System Admin', 'admin@quickoffice.com', adminPassword, 'admin']
      );
    }

    const checkTutorials = await pool.query('SELECT COUNT(*) FROM tutorials');
    if (parseInt(checkTutorials.rows[0].count) === 0) {
      console.log('Seeding database with initial tutorials...');
      const initialTutorials = [
        {
          title: 'Excel Basics: Sum & Average',
          tool: 'Excel',
          video_url: 'https://www.youtube.com/embed/rwbho0CgEAE',
          points: ['Learn the SUM function', 'Master the AVERAGE formula', 'Understand cell ranges'],
          pro_tip: 'Use Alt + = for a quick AutoSum!',
          description: 'The foundation of all spreadsheet work.'
        },
        {
          title: 'Word: Professional Formatting',
          tool: 'Word',
          video_url: 'https://www.youtube.com/embed/S-nHYzK-BVg',
          points: ['Using Styles for headers', 'Inserting Page Breaks', 'Adjusting Line Spacing'],
          pro_tip: 'Ctrl + Shift + N clears all formatting instantly.',
          description: 'Make your documents look like they were made by a pro.'
        }
      ];

      for (const t of initialTutorials) {
        await pool.query(
          'INSERT INTO tutorials (title, tool, video_url, points, pro_tip, description) VALUES ($1, $2, $3, $4, $5, $6)',
          [t.title, t.tool, t.video_url, t.points, t.pro_tip, t.description]
        );
      }
      console.log('Database seeded successfully');
    }
  } catch (err) {
    console.error('Database seeding error:', err);
  }
};

let dbInitialized = false;

const ensureDb = async () => {
  if (dbInitialized) return;
  await initDb();
  await seedDb();
  dbInitialized = true;
};

// --- API Routes ---

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    await ensureDb();
    if (!connectionString) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'No connection string configured. Check Vercel Environment Variables.' 
      });
    }
    const dbCheck = await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date() });
  } catch (err) {
    console.error('Health check DB error:', err.message);
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected', 
      error: err.message,
      hint: 'Ensure your Vercel Postgres database is active and SSL is allowed.' 
    });
  }
});

// Database Stats
app.get('/api/admin/db-stats', async (req, res) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const tutorialsCount = await pool.query('SELECT COUNT(*) FROM tutorials');
    const statsCount = await pool.query('SELECT COUNT(*) FROM stats');
    
    res.json({
      users: parseInt(usersCount.rows[0].count),
      tutorials: parseInt(tutorialsCount.rows[0].count),
      stats: parseInt(statsCount.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  let { fullname, email, password } = req.body;
  if (typeof password !== 'string' && typeof password !== 'number') {
    return res.status(400).json({ message: 'Password must be a string or a number' });
  }
  const passwordStr = String(password);
  try {
    const hashedPassword = await bcrypt.hash(passwordStr, 10);
    const result = await pool.query(
      'INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING id, fullname, email, role',
      [fullname, email, hashedPassword]
    );
    const user = result.rows[0];
    
    // Initialize stats for new user
    await pool.query(
      'INSERT INTO stats (user_id, xp, streak, completed_lessons, current_tool) VALUES ($1, 0, 0, $2, $3)',
      [user.id, [], 'Excel']
    );

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ user, token });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Email already registered' });
    }
    res.status(400).json({ message: err.message || 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (typeof password !== 'string' && typeof password !== 'number') {
    return res.status(400).json({ message: 'Password must be a string or a number' });
  }
  const passwordStr = String(password);
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(passwordStr, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stats Routes
app.get('/api/stats/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid User ID' });
  }
  try {
    const result = await pool.query('SELECT * FROM stats WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Stats not found' });
    }
    const stats = result.rows[0];
    // Map DB fields to frontend camelCase if necessary
    res.json({
      xp: stats.xp,
      streak: stats.streak,
      completedLessons: stats.completed_lessons || [],
      currentTool: stats.current_tool,
      lastCompletionDate: stats.last_completion_date
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/stats/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid User ID' });
  }
  const { xp, streak, completedLessons, currentTool, lastCompletionDate } = req.body;
  try {
    await pool.query(
      `INSERT INTO stats (user_id, xp, streak, completed_lessons, current_tool, last_completion_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET
       xp = EXCLUDED.xp,
       streak = EXCLUDED.streak,
       completed_lessons = EXCLUDED.completed_lessons,
       current_tool = EXCLUDED.current_tool,
       last_completion_date = EXCLUDED.last_completion_date`,
      [userId, xp, streak, completedLessons, currentTool, lastCompletionDate]
    );
    res.json({ message: 'Stats updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lessons/Tutorials Routes
app.get('/api/lessons', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tutorials');
    res.json(result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      tool: row.tool,
      tutorialContent: {
        title: row.title,
        points: row.points,
        proTip: row.pro_tip,
        videoUrl: row.video_url
      },
      description: row.description,
      questions: [], // These might be static or stored elsewhere, for now empty
      performanceSteps: [],
      xpReward: 50
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/lessons', async (req, res) => {
  const { title, tool, tutorialContent, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tutorials (title, tool, video_url, points, pro_tip, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [title, tool, tutorialContent.videoUrl, tutorialContent.points, tutorialContent.proTip, description]
    );
    res.json({ id: result.rows[0].id.toString(), message: 'Lesson saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/lessons/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tutorials WHERE id = $1', [req.params.id]);
    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Vite Middleware for Development
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  })();
} else {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile('dist/index.html', { root: '.' });
  });
}

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;