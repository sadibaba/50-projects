import express, { json } from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();


app.use(cors());
app.use(json());


app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);


app.get('/', (req, res) => {
  res.send('Task Manager API is running...');
});

export default app;