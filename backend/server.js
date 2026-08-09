import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/auth/authRoutes.js';
import contactRoutes from './src/contact/contactRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// GET API
app.get('/', (req, res) => {
    res.send("PDFTools  is running successfully")
});

app.use('/api/auth', authRoutes);
app.use('/api/tools', authRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;