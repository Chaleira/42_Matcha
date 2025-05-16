import { Router } from "express";
import { chatController } from "../controller/chatController";
import { catchAsync } from "../utils/catchAsync";
import { validateQueryParams, validateBodyParams } from "../middleware/validationMiddleware";

const router = Router();

router.post("/create", validateQueryParams(["user_id"], ["user_id"]), validateBodyParams(null), catchAsync(chatController.createChat));
router.post("/delete", validateQueryParams(["chat_id"], ["chat_id"]), validateBodyParams(null), catchAsync(chatController.deleteChat));

router.post("/create/message", validateQueryParams(["chat_id"], ["chat_id"]), validateBodyParams(["message"], ["message"]), catchAsync(chatController.createMessage));
router.post("/delete/message", validateQueryParams(["message_id"], ["message_id"]), validateBodyParams(null), catchAsync(chatController.deleteMessage));

router.get("/get/messages", validateQueryParams(["chat_id"], ["chat_id"]), validateBodyParams(null), catchAsync(chatController.getChatMessages));
router.get("/get", validateQueryParams(["chat_id"], ["chat_id"]), validateBodyParams(null), catchAsync(chatController.getChat));
router.get("/get/user-chats", validateQueryParams(null), validateBodyParams(null), catchAsync(chatController.getUserChats));

export default router;
