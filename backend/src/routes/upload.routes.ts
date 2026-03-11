import { Router } from 'express';
import { confirmUpload, deleteUpload, directUpload, presignUpload } from '../controllers/upload.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

const router = Router();
router.use(authMiddleware);

router.post('/presign', presignUpload);
router.post('/confirm', confirmUpload);
router.post('/direct', upload.single('audio'), directUpload);
router.delete('/:code', deleteUpload);

export default router;
