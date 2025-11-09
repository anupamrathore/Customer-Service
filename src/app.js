// src/app.js
import express from 'express';
import dotenv from 'dotenv';
import db from './db/config.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();
app.use(express.json());

// Mount API routes under /v1
app.use('/v1', routes);

// Root health check (optional)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'customer-service' });
});

// Start server after syncing DB
const PORT = process.env.PORT || 3001;
db.sync()
  .then(() => {
    console.log('✅ Database connected and synced!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ DB connection error:', err));
