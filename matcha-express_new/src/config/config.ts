import dotenv from 'dotenv';

dotenv.config();

export const DB_URL = process.env.DATABASE_URL
export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const EMAIL_PASS = process.env.EMAIL_PASS || 'your_email_password';
export const EMAIL_USER = process.env.EMAIL_USER || 'your_email_user'
export const URL_BACKEND = process.env.URL_BACKEND || 'localhost:3000'
export const URL_FRONTEND = process.env.URL_FRONTEND || 'localhost:5173'