import { Router } from 'express';

import { getCategoryData } from '../controller/static-data.js';

const router = Router();

// /v1/static-data
router.get('/category', getCategoryData);

export default router;