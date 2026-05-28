import express from 'express';
import { getTasks, createTask, updateTask, toggleComplete, deleteTask } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .patch(protect, toggleComplete)
  .delete(protect, deleteTask);

export default router;
