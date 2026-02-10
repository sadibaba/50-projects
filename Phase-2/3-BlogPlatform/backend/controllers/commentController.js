import Comment from '../models/commentModel.js';

// Add Comment
export const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.body.postId,
      user: req.user._id,
      content: req.body.content,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Comments for a Post
export const getComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId }).populate('user', 'name');
  res.json(comments);
};

// Delete Comment
export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });

  if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await comment.deleteOne();
  res.json({ message: 'Comment removed' });
};