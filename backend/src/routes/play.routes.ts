import { Router } from 'express';
import { getPlayableAudio } from '../controllers/play.controller';

const router = Router();
router.get('/:code', getPlayableAudio);

export default router;
