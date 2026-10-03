import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ─────────────────────────────────────────────────────────
// AUTH: Register
// ─────────────────────────────────────────────────────────
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            bio: 'Passionate writer and reader. Exploring the world one story at a time.',
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            avatar: user.avatar,
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────
// AUTH: Login
// ─────────────────────────────────────────────────────────
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
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────
// GET own profile (with stats + full lists)
// ─────────────────────────────────────────────────────────
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('followers', 'name email avatar')
            .populate('following', 'name email avatar');

        if (!user) return res.status(404).json({ message: 'User not found' });

        const Post = (await import('../models/postModel.js')).default;
        const postCount = await Post.countDocuments({ author: user._id });

        const stats = {
            posts: postCount,
            likes: 0,
            comments: 0,
            followers: user.followers.length,
            following: user.following.length,
        };

        return res.json({ ...user.toObject(), stats });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────
// UPDATE profile
// ─────────────────────────────────────────────────────────
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
        console.error('Update profile error:', error);
        return res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────
// UPDATE avatar (local disk)
// ─────────────────────────────────────────────────────────
export const updateAvatar = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const userId = req.user._id;
        const avatarPath = `/uploads/avatars/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            userId,
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
        console.error('Update avatar error:', error);
        return res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────
// GET user by username (public view)
// ─────────────────────────────────────────────────────────
export const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({
            name: { $regex: new RegExp(`^${username}$`, 'i') },
        })
            .select('-password')
            .populate('followers', 'name email avatar')
            .populate('following', 'name email avatar');

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Following status — only if requester is authenticated
        let isFollowing = false;
        if (req.user?._id) {
            isFollowing = user.followers.some(
                f => f._id.toString() === req.user._id.toString()
            );
        }

        const Post = (await import('../models/postModel.js')).default;
        const postCount = await Post.countDocuments({ author: user._id });

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            avatar: user.avatar,
            createdAt: user.createdAt,
            followers: user.followers,
            following: user.following,
            stats: {
                posts: postCount,
                likes: 0,
                comments: 0,
                followers: user.followers.length,
                following: user.following.length,
            },
            isFollowing,
        });
    } catch (error) {
        console.error('Get user by username error:', error);
        return res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────
// FOLLOW user — atomic, idempotent, consistent
// ─────────────────────────────────────────────────────────
export const followUser = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const userToFollowId = req.params.userId;

        if (currentUserId.toString() === userToFollowId) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const target = await User.findById(userToFollowId);
        if (!target) return res.status(404).json({ message: 'User not found' });

        // $addToSet — idempotent, no duplicates possible
        await User.updateOne(
            { _id: currentUserId },
            { $addToSet: { following: userToFollowId } }
        );
        await User.updateOne(
            { _id: userToFollowId },
            { $addToSet: { followers: currentUserId } }
        );

        return res.json({ success: true, message: 'User followed successfully' });
    } catch (error) {
        console.error('Follow user error:', error);
        return res.status(500).json({ message: error.message });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const userToUnfollowId = req.params.userId;

        await User.updateOne(
            { _id: currentUserId },
            { $pull: { following: userToUnfollowId } }
        );
        await User.updateOne(
            { _id: userToUnfollowId },
            { $pull: { followers: currentUserId } }
        );

        return res.json({ success: true, message: 'User unfollowed successfully' });
    } catch (error) {
        console.error('Unfollow user error:', error);
        return res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────
// GET followers
// ─────────────────────────────────────────────────────────
export const getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('followers', 'name email avatar bio');
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json({ success: true, followers: user.followers });
    } catch (error) {
        console.error('Get followers error:', error);
        return res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────
// GET following
// ─────────────────────────────────────────────────────────
export const getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('following', 'name email avatar bio');
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json({ success: true, following: user.following });
    } catch (error) {
        console.error('Get following error:', error);
        return res.status(500).json({ message: error.message });
    }
};