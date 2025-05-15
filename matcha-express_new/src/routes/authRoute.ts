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

router.get("/verify-email", validateQueryParams(["token"]), validateBodyParams(null), catchAsync(authController.verifyEmail));

export default router;
