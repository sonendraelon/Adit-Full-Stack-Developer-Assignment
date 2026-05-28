"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (res, userId) => {
    const token = jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return token;
};
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User_1.default.create({
        name,
        email,
        password,
        role: 'user',
    });
    if (user) {
        const token = generateToken(res, user._id.toString());
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};
exports.registerUser = registerUser;
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        const token = generateToken(res, user._id.toString());
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
};
exports.loginUser = loginUser;
// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'strict',
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logoutUser = logoutUser;
// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User_1.default.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
};
exports.getUserProfile = getUserProfile;
