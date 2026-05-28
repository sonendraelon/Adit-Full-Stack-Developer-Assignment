import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from '../routes/authRoutes';
import User from '../models/User';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Simple mock for mongoose to avoid real DB connections in this basic test setup
jest.mock('../models/User');

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should return 400 if user already exists', async () => {
      // Mock finding an existing user
      (User.findOne as jest.Mock).mockResolvedValue({ _id: '123', email: 'test@example.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });

    it('should create a new user and return 201', async () => {
      // Mock that user does not exist
      (User.findOne as jest.Mock).mockResolvedValue(null);
      // Mock user creation
      (User.create as jest.Mock).mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        name: 'New User',
        email: 'new@example.com',
        role: 'user'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'new@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.name).toBe('New User');
    });
  });
});
