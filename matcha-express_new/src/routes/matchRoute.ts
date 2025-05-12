import { Router } from "express";
import { matchController } from "../controller/matchController";
import { catchAsync } from "../utils/catchAsync";
import { validateBodyParams, validateQueryParams } from "../middleware/validationMiddleware";

const router = Router();

router.get('/user-matches', validateQueryParams(null), validateBodyParams(null), catchAsync(matchController.getMatchesForUser));
router.get('/get', validateQueryParams(["user1_id", "user2_id"], ["user1_id", "user2_id"]), validateBodyParams(null), catchAsync(matchController.getMatch));

export default router;