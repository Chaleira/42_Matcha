import { Router } from "express";
import { authController } from "../controller/authController";
import { catchAsync } from "../utils/catchAsync";
import { validateBodyParams, validateQueryParams } from "../middleware/validationMiddleware";

const allowedRegisterParams = ["username", "email", "first_name", "last_name", "password"];
const allowedLoginParams = ["username", "password"];

const router = Router();

router.post("/register", validateQueryParams(null), validateBodyParams(allowedRegisterParams), catchAsync(authController.register));
router.post("/login", validateQueryParams(null), validateBodyParams(allowedLoginParams), catchAsync(authController.login));

export default router;
