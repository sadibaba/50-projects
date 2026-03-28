import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

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
      bio: "Passionate writer and reader. Exploring the world one story at a time.",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('followers', 'name email avatar')
      .populate('following', 'name email avatar');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Calculate stats
    const stats = {
      posts: 0, // You'll need to count posts from Post model
      likes: 0,
      comments: 0,
      followers: user.followers.length,
      following: user.following.length,
    };
    
    res.json({
      ...user.toObject(),
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, bio, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info
    if (name) user.name = name;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      user: userResponse,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update avatar
export const updateAvatar = async (req, res) => {
  try {
    console.log('Avatar upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user._id;
    
    // Get the full URL for the avatar
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const avatarUrl = `${baseUrl}/uploads/avatars/${req.file.filename}`;
    
    console.log('Saving avatar URL:', avatarUrl);

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      avatar: avatarUrl,
      user,
      message: 'Avatar updated successfully'
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user by username
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ 
      name: { $regex: new RegExp(`^${username}$`, 'i') }
    })
    .select('-password')
    .populate('followers', 'name email avatar')
    .populate('following', 'name email avatar');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if current user is following this user
    let isFollowing = false;
    if (req.user && req.user._id) {
      isFollowing = user.followers.some(
        follower => follower._id.toString() === req.user._id.toString()
      );
    }
    
    res.json({
      ...user.toObject(),
      isFollowing,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Follow user
export const followUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const userToFollowId = req.params.userId;

    if (currentUserId.toString() === userToFollowId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(currentUserId);
    
    // Check if already following
    if (currentUser.following.includes(userToFollowId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Add to following and followers
    await User.findByIdAndUpdate(currentUserId, {
      $push: { following: userToFollowId }
    });
    
    await User.findByIdAndUpdate(userToFollowId, {
      $push: { followers: currentUserId }
    });

    res.json({ success: true, message: 'User followed successfully' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Unfollow user
export const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const userToUnfollowId = req.params.userId;

    const currentUser = await User.findById(currentUserId);
    
    // Check if following
    if (!currentUser.following.includes(userToUnfollowId)) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    // Remove from following and followers
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userToUnfollowId }
    });
    
    await User.findByIdAndUpdate(userToUnfollowId, {
      $pull: { followers: currentUserId }
    });

    res.json({ success: true, message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get followers
export const getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('followers', 'name email avatar bio');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      followers: user.followers
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get following
export const getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('following', 'name email avatar bio');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      following: user.following
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: error.message });
  }
};