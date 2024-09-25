import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './controller/user/UserController';
import chatRoutes from './controller/chat/ChatController';
import { env } from '../env';


const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

// Middleware
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', chatRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${env.mongodb.username}:${env.mongodb.password}@matcha.rp96o.mongodb.net/matcha`)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

export default app;