import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Post content is required']
    },
    excerpt: {
        type: String,
        default: ''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    tags: [String],
    image: {
        url: String,
        publicId: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
});

// Generate unique slug from title before saving
// NOTE: async pre-hooks in Mongoose 6+ do NOT receive `next` as a parameter.
// Throw an error to signal failure, or just return to signal success.
postSchema.pre('save', async function () {
    if (!this.isModified('title') && this.slug) return;

    if (this.title) {
        let slug = this.title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        // Ensure slug is unique
        const existingPost = await this.constructor.findOne({ slug });
        if (existingPost && existingPost._id.toString() !== this._id?.toString()) {
            slug = `${slug}-${Date.now()}`;
        }

        this.slug = slug;
    }
});

const Post = mongoose.model('Post', postSchema);
export default Post;