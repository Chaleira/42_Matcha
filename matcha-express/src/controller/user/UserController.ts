import app from "../..";
import express, { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}
import {IUser, UserModel, hasField } from "../../model/user/UserModel";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from "../../middleware/AuthMiddleware";
import { Model } from "mongoose";


const router = express.Router();

const SECRET_KEY = 'your_jwt_secret_key';

router.post('/user/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, dateBirth, userLocation, avatar, album,
            firstName, lastName, bio, tags, gender, sexualOrientation} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      dateBirth,
      avatar,
      album,
      firstName,
      lastName,
      bio,
      tags,
      gender,
      sexualOrientation,
      userLocation,
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

router.get('/user/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
      const user = await UserModel.findById(req.user?.id).select('-password -isDeleted -__v');
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
    }).select('-password -isDeleted -__v');
    
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
    const deletedUser = await UserModel.findByIdAndUpdate(req.user?.id, { isDeleted: true }).select('-password -isDeleted -__v');

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' , deletedUser});
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// GET /users/list?name=John&age=30&email=test@example.com
router.get('/user/list', authenticateToken, async (req: Request, res: Response) => {
  try {
    // Initialize an empty filter object
    const filters: Record<string, any> = {};
    const invalidFilters: string[] = ['password', 'isDeleted', 'email'];
    const invalidKeys: string[] = [];
    const validKeys: string[] = ["location", "radius" ]

    // Extract location parameters
    const { location, radius } = req.query;

    // Parse location and radius if provided
    if (location && typeof location === 'string') {
      const [longitude, latitude] = location.split(',').map(Number);
      if (!isNaN(longitude) && !isNaN(latitude)) {
        const radiusInMeters = radius ? parseInt(radius as string, 10) : 10000; // Default radius
        filters.userLocation = {
          $geoWithin: {
            $centerSphere: [
              [longitude, latitude], // Coordinates
              radiusInMeters / 6378100 // Radius in radians
            ]
          }
        };
      }
    }

    // Dynamically add query parameters to the filters object
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key) && hasField(UserModel, key) && !invalidFilters.includes(key)) {
        // Handle cases like age where the value needs to be parsed into a number
        if (key === 'age') {
          const ageParam = req.query[key] as string;
          
          // Check if the age parameter contains a range (e.g., '20-30')
          if (ageParam.includes('-')) {
            const [minAge, maxAge] = ageParam.split('-').map(Number);
            filters[key] = { $gte: minAge, $lte: maxAge };
          } else {
            filters[key] = parseInt(ageParam, 10);
        }
        } else {
          filters[key] = req.query[key];
        }
      }
      else {
        if (!validKeys.includes(key)) 
          invalidKeys.push(key);
      }
    }

    // Find users with the dynamically constructed filters
    const users = await UserModel.find(filters).select('-password -isDeleted -__v');
    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }

    if (invalidKeys.length > 0) {
      res.status(400).json({
        message: `Some invalid properties were sent: ${invalidKeys.join(', ')}`,
        users: users,
      });
    } else {
      res.status(200).json(users);
    }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/user/like', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  var msg;
  try {
    const { userLikingId, userBeingLikedId } = req.body;
    const userLiking = await UserModel.findById(userLikingId).select('-password -isDeleted -__v');
    const userBeingLiked = await UserModel.findById(userBeingLikedId).select('-password -isDeleted -__v');
    if (!userLiking || !userBeingLiked)
      return res.status(404).json({ message: 'User not found' });
    console.log("User Liking ID: " + userLikingId + "(" + userLiking.username + ")");
    console.log("User Being Liked ID: " + userBeingLikedId + "(" + userBeingLiked.username + ")");
    if (!userLiking.liked.includes(userBeingLikedId)) {
      userLiking.liked.push(userBeingLiked);
      if (userBeingLiked.liked.includes(userLikingId) && !userLiking.matched.includes(userBeingLikedId) && !userBeingLiked.matched.includes(userLikingId)) {
        userLiking.matched.push(userBeingLiked);
        userBeingLiked.matched.push(userLiking);
        msg = { message: 'You have a new match with ' + userLiking.username };
      }
      await userBeingLiked.save();
      await userLiking.save();
      return res.status(200).json(msg ? msg : { message: 'User liked successfully' });
    }
    else {
      if (userLiking.matched.includes(userBeingLikedId) && userBeingLiked.matched.includes(userLikingId)){
        const index = userLiking.matched.indexOf(userBeingLikedId);
        if (index > -1) {
          userLiking.matched.splice(index, 1);
          await userLiking.save();
        }
        const index2 = userBeingLiked.matched.indexOf(userLikingId);
        if (index2 > -1) {
          userBeingLiked.matched.splice(index2, 1);
          await userBeingLiked.save();
        }
        msg = { message: 'You have unmatched with ' + userBeingLiked.username };
      }
      const index = userLiking.liked.indexOf(userBeingLikedId);
      if (index > -1) {
        userLiking.liked.splice(index, 1);
        await userLiking.save();
      }
      return res.status(200).json(msg ? msg : { message: 'User unliked successfully' });
    }
  }
  catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/user/block', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userBlockingId, userBlockedId } = req.body;
    const userBlocking = await UserModel.findById(userBlockingId).select('-password -isDeleted -__v');
    if (!userBlocking)
      return res.status(404).json({ message: 'User not found' });
    if (!userBlocking.blocked.includes(userBlockedId)) {
      userBlocking.blocked.push(userBlockedId);
      await userBlocking.save();
      return res.status(200).json({ message: 'User blocked successfully' });
    }
    else {
      const index = userBlocking.blocked.indexOf(userBlockedId);
      if (index > -1) {
        userBlocking.blocked.splice(index, 1);
        await userBlocking.save();
      }
      return res.status(200).json({ message: 'User unblocked successfully' });
    }
  }
  catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

console.log('User controller loaded');

export default router;