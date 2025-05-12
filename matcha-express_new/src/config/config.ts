import dotenv from 'dotenv';

dotenv.config();

export const DB_URL = process.env.DATABASE_URL
export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';