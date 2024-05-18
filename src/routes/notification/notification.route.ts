import { notificationController } from '@/container/notification.container';
import { authenticateJWT } from '@/middleware/jwt.authenticate.middleware';
import express from 'express';

const notificationRouter = express.Router();

notificationRouter

.get('/list', authenticateJWT, notificationController.getNotificationList.bind(notificationController))
.delete('/', authenticateJWT, notificationController.deleteNotification.bind(notificationController))
export default notificationRouter;