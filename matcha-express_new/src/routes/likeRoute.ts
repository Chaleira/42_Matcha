import { Router } from "express";
import { likeController } from "../controller/likeController";
import { catchAsync } from "../utils/catchAsync";
import { validateBodyParams, validateQueryParams } from "../middleware/validationMiddleware";

const router = Router();

router.post('/create', validateQueryParams(["liked_id"], ["liked_id"]), validateBodyParams(null), catchAsync(likeController.createLike));
router.post('/delete', validateQueryParams(["liked_id"], ["liked_id"]), validateBodyParams(null), catchAsync(likeController.deleteLike));

router.get('/get', validateQueryParams(["user_id"], ["user_id"]), validateBodyParams(null), catchAsync(likeController.getLike));
router.get('/by-liker', validateQueryParams(["liker_id"], ["liker_id"]), validateBodyParams(null), catchAsync(likeController.getLikesByLiker));
router.get('/by-liked', validateQueryParams(["liked_id"], ["liked_id"]), validateBodyParams(null), catchAsync(likeController.getLikesByLiked));

export default router;