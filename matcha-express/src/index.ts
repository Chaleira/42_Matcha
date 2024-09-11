import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import userRoutes from './controller/user/UserController';
import {authenticateToken} from './middleware/AuthMiddleware';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use('/api', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://zequielzico:Vox9KeRE4lmy5sZH@matcha.rp96o.mongodb.net/matcha')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

export default app;