
/**
 * QUICKOFFICE POSTGRESQL SCHEMA (For pgAdmin 4)
 * -------------------------------------------
 * CREATE TABLE users (
 *   id SERIAL PRIMARY KEY,
 *   fullname VARCHAR(100),
 *   email VARCHAR(100) UNIQUE,
 *   password VARCHAR(255),
 *   role VARCHAR(20) DEFAULT 'student',
 *   joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * CREATE TABLE stats (
 *   user_id INTEGER REFERENCES users(id),
 *   xp INTEGER DEFAULT 0,
 *   streak INTEGER DEFAULT 0,
 *   completed_lessons TEXT[], -- Array of lesson IDs
 *   current_tool VARCHAR(50),
 *   last_completion_date DATE
 * );
 * 
 * CREATE TABLE tutorials (
 *   id SERIAL PRIMARY KEY,
 *   title VARCHAR(255),
 *   tool VARCHAR(50),
 *   video_url TEXT,
 *   points TEXT[],
 *   pro_tip TEXT,
 *   description TEXT,
 *   created_by INTEGER REFERENCES users(id)
 * );
 */

const BASE_URL = '/api'; // Relative path for the same-origin server

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('quickoffice_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

export const api = {
  // Check if backend is alive
  checkHealth: async () => {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { 
          ok: false, 
          message: data.message || data.error || 'Database connection failed' 
        };
      }
      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: 'Backend server is not responding' };
    }
  },

  // Auth
  login: async (credentials: any) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  signup: async (userData: any) => {
    return request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // User Data & Stats
  getStats: async (userId: string) => {
    return request(`/stats/${userId}`);
  },

  updateStats: async (userId: string, stats: any) => {
    return request(`/stats/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(stats)
    });
  },

  // Tutorials (CRUD for Postgres)
  getLessons: async () => {
    return request('/lessons');
  },

  saveLesson: async (lesson: any) => {
    return request('/lessons', {
      method: 'POST',
      body: JSON.stringify(lesson)
    });
  },

  deleteLesson: async (id: string) => {
    return request(`/lessons/${id}`, {
      method: 'DELETE'
    });
  },

  getDbStats: async () => {
    return request('/admin/db-stats');
  }
};
