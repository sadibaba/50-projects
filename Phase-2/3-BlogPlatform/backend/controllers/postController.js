import Post from '../models/postModel.js';

// Create Post
export const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
      tags: req.body.tags,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Posts
export const getPosts = async (req, res) => {
  const posts = await Post.find().populate('author', 'name email');
  res.json(posts);
};

// Get Single Post
export const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name email');
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
};

// Update Post
export const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  post.tags = req.body.tags || post.tags;

  const updatedPost = await post.save();
  res.json(updatedPost);
};

// Delete Post
export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await post.deleteOne();
  res.json({ message: 'Post removed' });
};
