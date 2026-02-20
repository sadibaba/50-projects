import { cloudinary } from '../config/cloudinary.js';

// Delete single image
export const deleteImage = async (publicId) => {
    try {
        if (!publicId) return;
        
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

// Delete multiple images
export const deleteMultipleImages = async (publicIds) => {
    try {
        if (!publicIds || publicIds.length === 0) return;
        
        const result = await cloudinary.api.delete_resources(publicIds);
        return result;
    } catch (error) {
        console.error('Error deleting images from Cloudinary:', error);
        throw error;
    }
};

// Optimize image URL
export const getOptimizedUrl = (publicId, options = {}) => {
    const { width = 800, height = 600, crop = 'fill', quality = 'auto' } = options;
    
    return cloudinary.url(publicId, {
        width,
        height,
        crop,
        quality,
        fetch_format: 'auto'
    });
};