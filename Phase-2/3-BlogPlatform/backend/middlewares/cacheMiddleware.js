const redisClient = require('../config/redis');

const cacheMiddleware = (duration = 3600) => {
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl}`;

        try {
            const cachedData = await redisClient.get(key);
            
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }

            // Store original send function
            const originalSend = res.json;
            
            // Override json method
            res.json = function(data) {
                // Cache the response
                redisClient.setEx(key, duration, JSON.stringify(data));
                
                // Call original send
                originalSend.call(this, data);
            };

            next();
        } catch (error) {
            console.error('Cache error:', error);
            next();
        }
    };
};

export default cacheMiddleware;