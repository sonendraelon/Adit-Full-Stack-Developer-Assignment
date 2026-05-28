import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get all tasks for user (or all if admin)
// @route   GET /api/tasks
// @access  Private
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

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
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

// @desc    Update a task (title, desc, priority, dueDate)
// @route   PUT /api/tasks/:id
// @access  Private
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

// @desc    Toggle task completed status
// @route   PATCH /api/tasks/:id
// @access  Private
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

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
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
