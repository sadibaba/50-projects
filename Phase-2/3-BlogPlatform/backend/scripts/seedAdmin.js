import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' MongoDB connected');

        const adminEmail = process.env.ADMIN_EMAIL || 's@s.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'password1-8';
        const adminName = process.env.ADMIN_NAME || 'Admin';

        // Delete existing admin with same email
        await User.deleteOne({ email: adminEmail });

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const admin = await User.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            bio: 'Blog Administrator — managing famous people stories.',
        });

        console.log(' Admin created successfully!');
        console.log(' Email:', adminEmail);
        console.log(' Password:', adminPassword);
        console.log(' Role:', admin.role);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error(' Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();