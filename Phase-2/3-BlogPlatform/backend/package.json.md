{
  "name": "blog-platform-backend",
  "version": "1.0.0",
  "description": "Production ready blog platform backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "prod": "NODE_ENV=production node server.js",
    "test": "jest --detectOpenHandles",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"**/*.{js,json}\"",
    "db:backup": "mongodump --uri $MONGODB_URI --out ./backups/$(date +%Y-%m-%d)",
    "db:restore": "mongorestore --uri $MONGODB_URI --drop",
    "prepare": "husky install"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "express-rate-limit": "^6.10.0",
    "rate-limit-redis": "^3.0.0",
    "redis": "^4.6.7",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "compression": "^1.7.4",
    "express-mongo-sanitize": "^2.2.0",
    "xss-clean": "^0.1.1",
    "hpp": "^0.2.3",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^1.41.0",
    "multer-storage-cloudinary": "^4.0.0",
    "winston": "^3.10.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "cookie-parser": "^1.4.6",
    "nodemailer": "^6.9.5",
    "express-async-errors": "^3.1.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.4",
    "supertest": "^6.3.3",
    "@types/jest": "^29.5.5",
    "eslint": "^8.49.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.28.1",
    "prettier": "^3.0.3",
    "husky": "^8.0.3",
    "lint-staged": "^14.0.1"
  },
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}