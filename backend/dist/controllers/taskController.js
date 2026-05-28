"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.toggleTaskStatus = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
// @desc    Get all tasks for user (or all if admin)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const status = req.query.status ? req.query.status : '';
    const search = req.query.search ? req.query.search : '';
    const query = {
        user: req.user?._id,
    };
    if (status && status !== 'all') {
        query.status = status;
    }
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }
    const count = await Task_1.default.countDocuments(query);
    const tasks = await Task_1.default.find(query)
        .populate('user', 'name email')
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
    const { title, description, priority } = req.body;
    if (!title?.trim()) {
        res.status(400);
        throw new Error('Title is required');
    }
    const task = new Task_1.default({
        title: title.trim(),
        description,
        priority: priority || 'Medium',
        user: req.user?._id,
    });
    const createdTask = await task.save();
    const populatedTask = await createdTask.populate('user', 'name email');
    res.status(201).json(populatedTask);
};
exports.createTask = createTask;
// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const { title, description, status, priority } = req.body;
    const task = await Task_1.default.findOne({ _id: req.params.id, user: req.user?._id });
    if (task) {
        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        const updatedTask = await task.save();
        const populatedTask = await updatedTask.populate('user', 'name email');
        res.json(populatedTask);
    }
    else {
        res.status(404);
        throw new Error('Task not found');
    }
};
exports.updateTask = updateTask;
// @desc    Toggle task status
// @route   PATCH /api/tasks/:id
// @access  Private
const toggleTaskStatus = async (req, res) => {
    const task = await Task_1.default.findOne({ _id: req.params.id, user: req.user?._id });
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    const updatedTask = await task.save();
    const populatedTask = await updatedTask.populate('user', 'name email');
    res.json(populatedTask);
};
exports.toggleTaskStatus = toggleTaskStatus;
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    const task = await Task_1.default.findOne({ _id: req.params.id, user: req.user?._id });
    if (task) {
        await Task_1.default.deleteOne({ _id: task._id });
        res.json({ message: 'Task removed' });
    }
    else {
        res.status(404);
        throw new Error('Task not found');
    }
};
exports.deleteTask = deleteTask;
