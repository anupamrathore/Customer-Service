import express from 'express';
import dotenv from 'dotenv';
import db from './db/config.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();
app.use(express.json());

// 🔹 Mount versioned API routes
app.use('/v1', routes);

// 🔹 Root health check (for Kubernetes / Docker)
app.get('/health', async (req, res) => {
  try {
    await db.authenticate();
    res.status(200).json({
      status: 'ok',
      service: 'customer-service',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      service: 'customer-service',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await db.sync();
    console.log('✅ Database connected and synced!');
    app.listen(PORT, () =>
      console.log(`🚀 Customer Service running on port ${PORT}`)
    );
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
};

startServer();
