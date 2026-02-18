backend/
├── utils/              # Utility functions
│   ├── AppError.js     # Custom error class
│   ├── catchAsync.js   # Async error wrapper
│   ├── apiFeatures.js  # Filtering, pagination
│   └── emailService.js # Email sending
├── config/             # Configuration files
│   ├── database.js     # DB config with pooling
│   ├── redis.js        # Redis configuration
│   └── cloudinary.js   # File upload config
├── services/           # Business logic
│   ├── authService.js
│   ├── postService.js
│   └── cacheService.js
├── middleware/         # All middleware
│   ├── errorMiddleware.js
│   ├── authMiddleware.js
│   ├── rateLimiter.js
│   ├── validationMiddleware.js
│   └── uploadMiddleware.js
├── validations/        # Input validation
│   ├── userValidation.js
│   ├── postValidation.js
│   └── commentValidation.js
├── logs/               # Application logs
│   └── app.log
└── tests/              # Testing
    ├── unit/
    └── integration/