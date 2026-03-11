import { Router } from 'express';
import {
  deleteQrCode,
  exportQrCsv,
  exportQrZip,
  generateQrBatch,
  getAdminStats,
  listQrCodes
} from '../controllers/admin.controller';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

router.use(adminMiddleware);
router.get('/stats', getAdminStats);
router.post('/qr/generate', generateQrBatch);
router.get('/qr/export', exportQrCsv);
router.get('/qr/export-zip', exportQrZip);
router.get('/qr/list', listQrCodes);
router.delete('/qr/:code', deleteQrCode);

export default router;
