import { Router } from "express";
import { blockController } from "../controller/blockController";
import { catchAsync } from "../utils/catchAsync";
import { validateBodyParams, validateQueryParams } from "../middleware/validationMiddleware";

const router = Router();

router.post("/create", validateQueryParams(["blocked_id"], ["blocked_id"]), validateBodyParams(null), catchAsync(blockController.createBlock));
router.post("/delete", validateQueryParams(["blocked_id"], ["blocked_id"]), validateBodyParams(null), catchAsync(blockController.deleteBlock));

router.get('/get', validateQueryParams(["user_id"], ["user_id"]), validateBodyParams(null), catchAsync(blockController.getBlock));
router.get("/by-blocker", validateQueryParams(["blocker_id"], ["blocker_id"]), validateBodyParams(null), catchAsync(blockController.getBlocksByBlocker));
router.get("/by-blocked", validateQueryParams(["blocked_id"], ["blocked_id"]), validateBodyParams(null), catchAsync(blockController.getBlocksByBlocked));

export default router;
