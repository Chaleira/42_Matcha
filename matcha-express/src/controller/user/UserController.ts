import app from "../..";
import express, { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}
import {IUser, UserModel } from "../../model/user/UserModel";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from "../../middleware/AuthMiddleware";
import { Model } from "mongoose";


const router = express.Router();

const SECRET_KEY = 'your_jwt_secret_key';

router.post('/user/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, age } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      age
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/user/login',  async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, message: 'Login successful' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/user/logout', (req: Request, res: Response) => {
  
  res.json({ message: 'Logout successful' });
});

router.get('/user/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
      const user = await UserModel.findById(req.user?.id);
      res.status(200).json(user);
  }
  catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/user/update', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const updateFields = req.body; // Get the fields to update from the request body

  const {password, ...allowedFields} = updateFields;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(req.user?.id, allowedFields, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation is applied to updated fields
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/user/delete', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = await UserModel.findById(req.user?.id)

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (user.isDeleted) {
    return res.status(400).json({ message: 'User already deleted' });
  }
  try {
    const deletedUser = await UserModel.findByIdAndUpdate(req.user?.id, { isDeleted: true });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' , deletedUser});
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

console.log('User controller loaded');

export default router;