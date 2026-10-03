import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────────────────
// HELPER: delete local file safely
// ─────────────────────────────────────────────────────────
const deleteLocalFile = async (relativePath) => {
    if (!relativePath) return;
    try {
        const fullPath = path.join(__dirname, '..', relativePath);
        await fs.unlink(fullPath);
    } catch (err) {
        // File may already be gone — safe to ignore
        console.warn('Could not delete local file:', relativePath, err.message);
    }
};

// ─────────────────────────────────────────────────────────
// CREATE POST
// ─────────────────────────────────────────────────────────
export const createPost = async (req, res) => {
    try {
        const { title, content, category, tags, excerpt } = req.body;

        if (!title?.trim()) return res.status(400).json({ success: false, message: 'Title is required' });
        if (!content?.trim()) return res.status(400).json({ success: false, message: 'Content is required' });
        if (!category?.trim()) return res.status(400).json({ success: false, message: 'Category is required' });
        if (!req.user?._id) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const postData = {
            title: title.trim(),
            content: content.trim(),
            excerpt: excerpt?.trim() || content.trim().substring(0, 150),
            author: req.user._id,
            authorName: req.user.name,
            category: category.trim(),
            tags: tags
                ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean))
                : [],
        };

        // LOCAL DISK: image stored as /uploads/posts/<filename>
        if (req.file) {
            postData.image = {
                url: `/uploads/posts/${req.file.filename}`,
                publicId: null, // no cloudinary
            };
        }

        const post = await Post.create(postData);

        return res.status(201).json({
            success: true,
            post,
        });
    } catch (error) {
        console.error('Create post error:', error.message);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message).join(', ');
            return res.status(400).json({ success: false, message: messages });
        }
        return res.status(500).json({ success: false, message: error.message || 'Server error while creating post' });
    }
};

// ─────────────────────────────────────────────────────────
// UPDATE POST
// ─────────────────────────────────────────────────────────
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
        }

        const { title, content, category, tags, excerpt } = req.body;

        if (title) post.title = title.trim();
        if (content) post.content = content.trim();
        if (category) post.category = category.trim();
        if (excerpt) post.excerpt = excerpt.trim();
        if (tags) post.tags = Array.isArray(tags)
            ? tags
            : tags.split(',').map(t => t.trim()).filter(Boolean);

        // Replace image if new file uploaded
        if (req.file) {
            // Delete old local image
            if (post.image?.url) {
                await deleteLocalFile(post.image.url);
            }
            post.image = {
                url: `/uploads/posts/${req.file.filename}`,
                publicId: null,
            };
        }

        await post.save();
        return res.status(200).json({ success: true, post });
    } catch (error) {
        console.error('Update post error:', error.message);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message).join(', ');
            return res.status(400).json({ success: false, message: messages });
        }
        return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// ─────────────────────────────────────────────────────────
// DELETE POST
// ─────────────────────────────────────────────────────────
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
        }

        // Delete local image file
        if (post.image?.url) {
            await deleteLocalFile(post.image.url);
        }

        await post.deleteOne();
        return res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error.message);
        return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// ─────────────────────────────────────────────────────────
// GET ALL POSTS
// ─────────────────────────────────────────────────────────
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name email avatar')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: posts.length,
            data: posts,
        });
    } catch (error) {
        console.error('Get posts error:', error.message);
        return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// ─────────────────────────────────────────────────────────
// GET SINGLE POST
// ─────────────────────────────────────────────────────────
export const getPost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('author', 'name email avatar');

        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        return res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error('Get post error:', error.message);
        return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// ─────────────────────────────────────────────────────────
// LIKE POST
// ─────────────────────────────────────────────────────────
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const userId = req.user._id.toString();
        if (post.likes.map(id => id.toString()).includes(userId)) {
            return res.status(400).json({ success: false, message: 'You already liked this post' });
        }

        post.likes.push(req.user._id);
        post.likesCount = post.likes.length;
        await post.save();

        return res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error('Like post error:', error.message);
        return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// ─────────────────────────────────────────────────────────
// UNLIKE POST
// ─────────────────────────────────────────────────────────
export const unlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const userId = req.user._id.toString();
        if (!post.likes.map(id => id.toString()).includes(userId)) {
            return res.status(400).json({ success: false, message: 'You have not liked this post' });
        }

        post.likes = post.likes.filter(id => id.toString() !== userId);
        post.likesCount = post.likes.length;
        await post.save();

        return res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error('Unlike post error:', error.message);
        return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};