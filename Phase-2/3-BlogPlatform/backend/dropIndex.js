import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropSlugIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Drop the slug index
    await db.collection('posts').dropIndex('slug_1');
    console.log('Successfully dropped slug_1 index');
    
    process.exit(0);
  } catch (error) {
    console.error('Error dropping index:', error);
    process.exit(1);
  }
};

dropSlugIndex();