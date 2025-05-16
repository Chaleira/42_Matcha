import e, { Router } from 'express';
import { notificationController } from '../controller/notificationController';
import { catchAsync } from '../utils/catchAsync';
import { validateQueryParams, validateBodyParams } from '../middleware/validationMiddleware';

const router = Router();

router.get('/get', validateQueryParams(null), validateBodyParams(null), catchAsync(notificationController.getNotifications));
router.get('/get-by-id', validateQueryParams(['id'], ['id']), validateBodyParams(null), catchAsync(notificationController.getNotification));

router.post('/create', validateQueryParams(null), validateBodyParams(['send_to_id', 'type', 'content'], ['send_to_id', 'type', 'content']), catchAsync(notificationController.createNotification));
router.post('/update', validateQueryParams(['id'], ['id']), validateBodyParams(['send_to_id', 'type', 'content', 'seen']), catchAsync(notificationController.updateNotification));
router.post('/delete', validateQueryParams(['id'], ['id']), validateBodyParams(null), catchAsync(notificationController.deleteNotification));

export default router;