import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Create a new post with image
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
    try {
        const { title, content, category, tags } = req.body;
        
        // Check if user exists
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Prepare post data
        const postData = {
            title,
            content,
            author: req.user.id,
            authorName: user.name,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        };

        // If image is uploaded
        if (req.file) {
            postData.image = {
                url: req.file.path,
                publicId: req.file.filename
            };
        }

        const post = await Post.create(postData);

        res.status(201).json({
            success: true,
            data: {
                post
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update post with image
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(new AppError('Post not found', 404));
        }

        // Check ownership
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new AppError('You are not authorized to update this post', 403));
        }

        // Update fields
        const { title, content, category, tags } = req.body;
        
        if (title) post.title = title;
        if (content) post.content = content;
        if (category) post.category = category;
        if (tags) post.tags = tags.split(',').map(tag => tag.trim());

        // If new image is uploaded
        if (req.file) {
            // Delete old image from cloudinary if exists
            if (post.image && post.image.publicId) {
                await cloudinary.uploader.destroy(post.image.publicId);
            }
            
            // Add new image
            post.image = {
                url: req.file.path,
                publicId: req.file.filename
            };
        }

        await post.save();

        res.status(200).json({
            success: true,
            data: {
                post
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete post (and its image)
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(new AppError('Post not found', 404));
        }

        // Check ownership
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new AppError('You are not authorized to delete this post', 403));
        }

        // Delete image from cloudinary if exists
        if (post.image && post.image.publicId) {
            await cloudinary.uploader.destroy(post.image.publicId);
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'name email');
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Agar user ne pehle se like kiya hai
    if (post.likes.includes(req.user.id)) {
      return next(new AppError('You already liked this post', 400));
    }

    post.likes.push(req.user.id);
    await post.save();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unlike a post
// @route   PUT /api/posts/:id/unlike
// @access  Private
export const unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Agar user ne like nahi kiya
    if (!post.likes.includes(req.user.id)) {
      return next(new AppError('You have not liked this post', 400));
    }

    post.likes = post.likes.filter(
      (userId) => userId.toString() !== req.user.id
    );
    await post.save();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};