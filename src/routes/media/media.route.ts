import { mediaController } from '@/container/media.container'
import { uploadPicture } from '@/utils/media/upload-photo.util';
import express from 'express'

const mediaRouter = express.Router()

mediaRouter

.get('/:pictureName', mediaController.getPicture.bind(mediaController))

.post('/upload', uploadPicture, mediaController.uploadPicture.bind(mediaController))

export default mediaRouter;