import { Router } from 'express';
import { userController } from '../controller/userController';
import { catchAsync } from '../utils/catchAsync';
import { validateQueryParams, validateBodyParams } from '../middleware/validationMiddleware';

const allowedListParams = ["age_min", "age_max", "gender", "sexual_preference", "fame_min", "tags", "name", "latitude", "longitude", "radius_km"];
const allowedUpdateParams = ["bio", "age", "tags", "gender", "sexual_preference", "pictures", "avatar", "fame_score", "latitude", "longitude", "first_name", "last_name"];

const router = Router();

router.post('/profile/update', validateQueryParams(null), validateBodyParams(allowedUpdateParams), catchAsync(userController.updateUserProfile));
router.post('/delete', validateQueryParams(null), validateBodyParams(null), catchAsync(userController.deleteUser));

router.get('/profile', validateQueryParams(["id"]), validateBodyParams(null), catchAsync(userController.getUserProfile));
router.get('/get', validateQueryParams(["id"], ["id"]), validateBodyParams(null), catchAsync(userController.getUserById));
router.get('/list', validateQueryParams(allowedListParams), validateBodyParams(null), catchAsync(userController.listUsers));

export default router;