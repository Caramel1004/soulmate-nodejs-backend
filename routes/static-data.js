import { Router } from 'express';

import { getCategoryData } from '../controller/static-data.js';

const router = Router();

/**
 * 1. 채널 카테고리 조회
 */


/** GET /api/v1/static-data/category
 * @method{GET}
 * @route {/api/v1/static-data/category}
 * 1. 채널 카테고리 조회
*/
router.get('/category', getCategoryData);

export default router;