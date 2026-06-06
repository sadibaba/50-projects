import User from '../models/user_model.js';
import jwt from 'jsonwebtoken';

export const register = async ({ username, email, password }) => {
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new User({ username, email, password });
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );
    
    return { 
      success: true, 
      message: 'User registered successfully',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const login = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    
   const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );
    
    return {
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    };
  } catch (error) {
    throw new Error(error.message);
  }
};