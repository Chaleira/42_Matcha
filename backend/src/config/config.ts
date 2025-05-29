import dotenv from 'dotenv';

dotenv.config();

const isProduction = (process.env.VITE_PRODUCTION === 'true');
export const DB_URL = isProduction ? process.env.DATABASE_URL : process.env.DATABASE_URL_DEV
export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const EMAIL_PASS = process.env.EMAIL_PASS || 'your_email_password';
export const EMAIL_USER = process.env.EMAIL_USER || 'your_email_user'
export const URL_BACKEND = process.env.URL_BACKEND || 'localhost:3000'
export const URL_FRONTEND = process.env.URL_FRONTEND || 'localhost:5173'

console.log('Configuration loaded:');
console.log(`DB_URL: ${DB_URL}`);
console.log(`PORT: ${PORT}`);
console.log(`JWT_SECRET: ${JWT_SECRET}`);
console.log(`JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}`);
console.log(`EMAIL_USER: ${EMAIL_USER}`);
console.log(`EMAIL_PASS: ${EMAIL_PASS}`);
console.log(`URL_BACKEND: ${URL_BACKEND}`);
console.log(`URL_FRONTEND: ${URL_FRONTEND}`);