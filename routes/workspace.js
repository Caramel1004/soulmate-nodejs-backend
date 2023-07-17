import { Router } from 'express';

import { hasJsonWebToken } from '../validator/valid.js';
import workspaceController from '../controller/workspace.js';

const router = Router();

/**
 * 1. 워크스페이스 세부정보 조회
 * 2. 작업물 업로드
 */

// GET /v1/workspace/:channelId/:workspaceId
router.get('/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.getLoadWorkspace);// 1. 워크스페이스 세부정보 조회


export default router;