const request = require('supertest');
const app = require('../../app');
const Post = require('../../models/postModel');
const User = require('../../models/userModel');

describe('Post Controller', () => {
    let token;
    let userId;

    beforeAll(async () => {
        // Create test user
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });
        userId = user._id;

        // Get token
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        token = response.body.token;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
    });

    describe('POST /api/posts', () => {
        it('should create a new post', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Post',
                    content: 'This is a test post',
                    category: 'Technology'
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.data.post.title).toBe('Test Post');
        });

        it('should not create post without title', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    content: 'This is a test post',
                    category: 'Technology'
                });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('GET /api/posts', () => {
        it('should get all posts with pagination', async () => {
            const response = await request(app)
                .get('/api/posts?page=1&limit=5')
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.results).toBeDefined();
            expect(response.body.data.posts).toBeInstanceOf(Array);
        });
    });
});