import { Router } from "express";
import { authController } from "../controller/authController";
import { catchAsync } from "../utils/catchAsync";
import { validateBodyParams, validateQueryParams } from "../middleware/validationMiddleware";

const allowedRegisterParams = ["username", "email", "first_name", "last_name", "password", "bio", "age", "tags", "gender", "sexual_preference", "pictures", "avatar", "fame_score", "latitude", "longitude"];
const requiredRegisterParams = ["username", "email", "first_name", "last_name", "password"]
const allowedLoginParams = ["username", "password"];

const router = Router();

router.post("/register", validateQueryParams(null), validateBodyParams(allowedRegisterParams, requiredRegisterParams), catchAsync(authController.register));
router.post("/login", validateQueryParams(null), validateBodyParams(allowedLoginParams, allowedLoginParams), catchAsync(authController.login));

router.get("/verify-email", validateQueryParams(["token"], ["token"]), validateBodyParams(null), catchAsync(authController.verifyEmail));
router.get("/send-reset-password-email", validateQueryParams(["email"], ["email"]), validateBodyParams(null), catchAsync(authController.resetPassword));
router.post("/reset-password", validateQueryParams(["token"], ["token"]), validateBodyParams(["password"], ["password"]), catchAsync(authController.verifyResetPassword));
router.post('/logout', (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
	});
	res.json({ message: 'Logout successful' });
});
export default router;
