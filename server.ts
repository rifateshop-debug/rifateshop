import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import admin from 'firebase-admin';
import fs from 'fs';

// Initialize Firebase Admin securely. 
// For default AI Studio setup, ADC might not have the right permissions out of the box if a service account isn't injected.
// Let's use the explicit Client SDK on the backend if needed, or see if admin works.
try {
  admin.initializeApp();
} catch(e) {
  console.log("Admin init error:", e);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (
    (username === 'rifatbinamirul' && password === 'Rifat2790$') ||
    (username === 'admin' && password === 'admin')
  ) {
    res.json({ token: 'admin_token_secure_123', success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials. Try admin / admin' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
