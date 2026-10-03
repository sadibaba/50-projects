import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { AppError } from './errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const postsUploadDir = path.join(__dirname, '../uploads/posts');
const avatarsUploadDir = path.join(__dirname, '../uploads/avatars');
ensureDir(postsUploadDir);
ensureDir(avatarsUploadDir);

// Storage for post cover images
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, postsUploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `post-${uniqueSuffix}${ext}`);
    },
});

// Storage for avatars
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, avatarsUploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `avatar-${uniqueSuffix}${ext}`);
    },
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new AppError('Only image files are allowed.', 400), false);
    }
};

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

export const uploadPostImage = multer({
    storage: postStorage,
    limits,
    fileFilter: imageFilter,
});

export const uploadAvatarImage = multer({
    storage: avatarStorage,
    limits,
    fileFilter: imageFilter,
});