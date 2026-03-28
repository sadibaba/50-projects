import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile,
  updateUserProfile,
  updateAvatar,
  getUserByUsername,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} from '../controllers/UserController.js';
import { protect } from '../middlewares/UserMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/avatars');
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// Public routes
router.post('/signup', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);
router.get('/:username', protect, getUserByUsername);

// Follow/Unfollow routes
router.post('/:userId/follow', protect, followUser);
router.post('/:userId/unfollow', protect, unfollowUser);
router.get('/:userId/followers', protect, getFollowers);
router.get('/:userId/following', protect, getFollowing);

export default router;