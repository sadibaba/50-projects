import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/categoryModel.js';

dotenv.config();

const categories = [
    { name: 'Actors', description: 'Film and television actors' },
    { name: 'Actresses', description: 'Film and television actresses' },
    { name: 'Singers', description: 'Musicians and singers' },
    { name: 'Politicians', description: 'Political leaders and figures' },
    { name: 'Sports Stars', description: 'Athletes and sports personalities' },
    { name: 'Business Leaders', description: 'Entrepreneurs and CEOs' },
    { name: 'Scientists', description: 'Scientists and researchers' },
    { name: 'Writers', description: 'Authors and poets' },
    { name: 'Influencers', description: 'Social media influencers' },
    { name: 'Historical Figures', description: 'Historical personalities' },
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' MongoDB connected');

        await Category.deleteMany({});
        await Category.insertMany(categories);

        console.log(` ${categories.length} categories created!`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error(' Error:', error.message);
        process.exit(1);
    }
};

seedCategories();