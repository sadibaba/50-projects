import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './config/logger.js';
import connectDB from "./database/db.js";

connectDB();
// Load environment variables
dotenv.config();

// Handle uncaught exceptions
process.on('uncaughtException', err => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    process.exit(1);
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        logger.info('✅ Connected to MongoDB successfully');
    })
    .catch(err => {
        logger.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('👋 SIGTERM received. Shutting down gracefully');
    server.close(() => {
        logger.info('💤 Process terminated');
    });
});