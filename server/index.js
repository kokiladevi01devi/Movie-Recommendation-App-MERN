import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.js';
import { movieRoutes } from './routes/movies.js';
import { commentRoutes } from './routes/comments.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/movie_app')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));