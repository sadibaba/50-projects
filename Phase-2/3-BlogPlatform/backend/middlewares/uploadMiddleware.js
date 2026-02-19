import multer from 'multer';
import { storage } from '../config/cloudinary';
import AppError from '../utils/AppError';

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new AppError('Not an image! Please upload only images.', 400), false);
        }
    }
});

export default upload;