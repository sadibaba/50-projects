const { body } = require('express-validator');

exports.registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    
    body('email')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/\d/).withMessage('Password must contain a number')
];

exports.loginValidation = [
    body('email')
        .isEmail().withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty().withMessage('Password is required')
];