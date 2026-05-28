import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

// Get all tasks for user (or all if admin)
export const getTasks = async (req: AuthRequest, res: Response) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const status = req.query.status ? req.query.status as string : '';
  const search = req.query.search ? req.query.search as string : '';

  const query: any = {};

  if (req.user?.role !== 'admin') {
    query.userId = req.user?.userId || req.user?._id;
  }

  if (status && status !== 'all') {
    query.completed = status === 'completed';
  }

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const count = await Task.countDocuments(query);
  const tasks = await Task.find(query)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ tasks, page, pages: Math.ceil(count / pageSize), total: count });
};

// Create a new task
export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, priority, dueDate } = req.body;

  const task = new Task({
    title,
    description,
    priority: priority || 'Medium',
    dueDate,
    userId: req.user?.userId || req.user?._id,
  });

  const createdTask = await task.save();
  const populatedTask = await createdTask.populate('userId', 'name email');
  res.status(201).json(populatedTask);
};

// Update task details
export const updateTask = async (req: AuthRequest, res: Response) => {
  const { title, description, priority, dueDate } = req.body;

  const task = await Task.findById(req.params.id);

  if (task) {
    if (req.user?.role !== 'admin' && task.userId.toString() !== (req.user?.userId || req.user?._id)?.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.priority = priority || task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

    const updatedTask = await task.save();
    const populatedTask = await updatedTask.populate('userId', 'name email');
    res.json(populatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};

// Toggle task completion status
export const toggleComplete = async (req: AuthRequest, res: Response) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    if (req.user?.role !== 'admin' && task.userId.toString() !== (req.user?.userId || req.user?._id)?.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    task.completed = !task.completed;

    const updatedTask = await task.save();
    const populatedTask = await updatedTask.populate('userId', 'name email');
    res.json(populatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};

// Delete task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    if (req.user?.role !== 'admin' && task.userId.toString() !== (req.user?.userId || req.user?._id)?.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }
    
    await Task.deleteOne({ _id: task._id });
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};
