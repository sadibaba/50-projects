import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ── Register ─────────────────────────────────────────────────
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'reader',
            hasSeenTutorial: false,
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            avatar: user.avatar,
            hasSeenTutorial: user.hasSeenTutorial,
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ── Login ────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            avatar: user.avatar,
            hasSeenTutorial: user.hasSeenTutorial || false,
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ── Get own profile ─────────────────────────────────────────
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const Post = (await import('../models/postModel.js')).default;
        const Comment = (await import('../models/commentModel.js')).default;

        const [postCount, commentCount] = await Promise.all([
            Post.countDocuments({ author: user._id }),
            Comment.countDocuments({ user: user._id }),
        ]);

        return res.json({
            ...user.toObject(),
            stats: {
                posts: postCount,
                comments: commentCount,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ── Update own profile ──────────────────────────────────────
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, bio, currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (bio !== undefined) user.bio = bio;

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.json({
            success: true,
            user: userResponse,
            message: 'Profile updated successfully',
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ── Update avatar ───────────────────────────────────────────
export const updateAvatar = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const avatarPath = `/uploads/avatars/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: avatarPath },
            { new: true }
        ).select('-password');
        return res.json({
            success: true,
            avatar: avatarPath,
            user,
            message: 'Avatar updated successfully',
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ── Mark tutorial seen ──────────────────────────────────────
export const markTutorialSeen = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { hasSeenTutorial: true });
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
