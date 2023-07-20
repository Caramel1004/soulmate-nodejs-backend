import { Router } from 'express';

import { hasJsonWebToken } from '../validator/valid.js';
import workspaceController from '../controller/workspace.js';

const router = Router();

/**
 * 1. 워크스페이스 세부정보 조회
 * 2. 자료 및 텍스트 내용 업로드
 * 3. 댓글 달기
 * 4. 워크스페이스에 팀원 초대
 * 5. 스크랩 따기
 */

// GET /v1/workspace/:channelId/:workspaceId
router.get('/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.getLoadWorkspace);// 1. 워크스페이스 세부정보 조회

// POST /v1/workspace/create-post/:channelId/:workSpaceId
router.post('/create-post/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.postUploadPost);// 2. 자료 및 텍스트 내용 업로드

//POST /v1/workspace/reply/:channelId/:workSpaceId
router.post('/reply/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.postCreateReply);// 3. 댓글 달기

//POST /v1/workspace/invite/:channelId/:workSpaceId
router.patch('/invite/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.patchAddMemberToWorkSpace);// 4. 워크스페이스에 팀원 초대


export default router;