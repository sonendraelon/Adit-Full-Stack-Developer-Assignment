"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.toggleComplete = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
// @desc    Get all tasks for user (or all if admin)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const status = req.query.status ? req.query.status : '';
    const search = req.query.search ? req.query.search : '';
    const query = {};
    if (req.user?.role !== 'admin') {
        query.userId = req.user?.userId || req.user?._id;
    }
    if (status && status !== 'all') {
        query.completed = status === 'completed';
    }
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }
    const count = await Task_1.default.countDocuments(query);
    const tasks = await Task_1.default.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    res.json({ tasks, page, pages: Math.ceil(count / pageSize), total: count });
};
exports.getTasks = getTasks;
// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    const { title, description, priority, dueDate } = req.body;
    const task = new Task_1.default({
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
exports.createTask = createTask;
// @desc    Update a task (title, desc, priority, dueDate)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const { title, description, priority, dueDate } = req.body;
    const task = await Task_1.default.findById(req.params.id);
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
    }
    else {
        res.status(404);
        throw new Error('Task not found');
    }
};
exports.updateTask = updateTask;
// @desc    Toggle task completed status
// @route   PATCH /api/tasks/:id
// @access  Private
const toggleComplete = async (req, res) => {
    const task = await Task_1.default.findById(req.params.id);
    if (task) {
        if (req.user?.role !== 'admin' && task.userId.toString() !== (req.user?.userId || req.user?._id)?.toString()) {
            res.status(403);
            throw new Error('Not authorized to update this task');
        }
        task.completed = !task.completed;
        const updatedTask = await task.save();
        const populatedTask = await updatedTask.populate('userId', 'name email');
        res.json(populatedTask);
    }
    else {
        res.status(404);
        throw new Error('Task not found');
    }
};
exports.toggleComplete = toggleComplete;
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    const task = await Task_1.default.findById(req.params.id);
    if (task) {
        if (req.user?.role !== 'admin' && task.userId.toString() !== (req.user?.userId || req.user?._id)?.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete this task');
        }
        await Task_1.default.deleteOne({ _id: task._id });
        res.json({ message: 'Task removed' });
    }
    else {
        res.status(404);
        throw new Error('Task not found');
    }
};
exports.deleteTask = deleteTask;
