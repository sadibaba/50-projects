import Post from '../models/postModel.js';
import User from '../models/userModel.js';

// Helper: create a simple error with status code
const createError = (message, statusCode) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
};

// @desc    Create a new post with image
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
    try {
        console.log('=== CREATE POST ===');
        console.log('Body:', req.body);
        console.log('File:', req.file);
        console.log('User:', req.user?._id, req.user?.name);

        const { title, content, category, tags, excerpt } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }
        if (!content?.trim()) {
            return res.status(400).json({ success: false, message: 'Content is required' });
        }
        if (!category?.trim()) {
            return res.status(400).json({ success: false, message: 'Category is required' });
        }
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        // Build post data — use req.user directly (protect middleware already populates it)
        const postData = {
            title: title.trim(),
            content: content.trim(),
            excerpt: excerpt?.trim() || content.trim().substring(0, 150),
            author: req.user._id,
            authorName: req.user.name,
            category: category.trim(),
            tags: tags
                ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean))
                : []
        };

        // Image from Cloudinary (multer-storage-cloudinary sets req.file.path & req.file.filename)
        if (req.file) {
            postData.image = {
                url: req.file.path,
                publicId: req.file.filename
            };
        }

        console.log('Creating post with data:', postData);
        const post = await Post.create(postData);
        console.log('Post created:', post._id);

        return res.status(201).json({
            success: true,
            post  // frontend checks response.post
        });

    } catch (error) {
        console.error('=== CREATE POST ERROR ===');
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);

        // Mongoose validation error — give a helpful message
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message).join(', ');
            return res.status(400).json({ success: false, message: messages });
        }

        return res.status(500).json({
            success: false,
            message: error.message || 'Server error while creating post'
        });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

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

        if (req.file) {
            // Delete old cloudinary image if it exists
            if (post.image?.publicId) {
                try {
                    const { cloudinary } = await import('../config/cloudinary.js');
                    await cloudinary.uploader.destroy(post.image.publicId);
                } catch (e) {
                    console.warn('Could not delete old image:', e.message);
                }
            }
            post.image = {
                url: req.file.path,
                publicId: req.file.filename
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

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
        }

        if (post.image?.publicId) {
            try {
                const { cloudinary } = await import('../config/cloudinary.js');
                await cloudinary.uploader.destroy(post.image.publicId);
            } catch (e) {
                console.warn('Could not delete image from Cloudinary:', e.message);
            }
        }

        await post.deleteOne();

        return res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error.message);
        return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 }); // newest first

        return res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        console.error('Get posts error:', error.message);
        return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('author', 'name email');

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        return res.status(200).json({ success: true, data: post });
    } catch (error) {
        console.error('Get post error:', error.message);
        return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

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

// @desc    Unlike a post
// @route   PUT /api/posts/:id/unlike
// @access  Private
export const unlikePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

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