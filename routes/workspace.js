import { Router } from 'express';
import multer from 'multer';

import { hasJsonWebToken, hasFile } from '../validator/valid.js';
import filesHandler from '../util/files-handler.js';

import workspaceController from '../controller/workspace.js';

const router = Router();

/**
 * 1. 워크스페이스 세부정보 조회
 * 2. 게시물 생성
 * 3. 댓글 달기 -> 게시물이 있어야 함
 * 4. 워크스페이스에 팀원 초대
 * 5. 스크랩 따기
 * 6. 댓글 보기
 * 7. 워크스페이스 설명 코멘트 편집
 * 8. 워크스페이스 퇴장
 * 9. 워크스페이스에서 해당 유저의 게시물 삭제
 * 10. 워크스페이스에서 해당 유저의 게시물 내용 수정
 */

// GET /v1/workspace/:channelId/:workspaceId
router.get('/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.getLoadWorkspace);// 1. 워크스페이스 세부정보 조회

// POST /v1/workspace/create-post/:channelId/:workSpaceId
router.post('/create-post/:channelId/:workSpaceId',
    hasJsonWebToken,
    multer({ storage: filesHandler.fileStorage, fileFilter: filesHandler.fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } }).array('files', 12),
    hasFile,
    filesHandler.saveUploadedFiles,
    workspaceController.postCreatePost
);// 2. 게시물 생성

//POST /v1/workspace/post/create-reply/:channelId/:workSpaceId
router.post('/post/create-reply/:channelId/:workSpaceId', hasJsonWebToken, multer({ storage: filesHandler.fileStorage, fileFilter: filesHandler.fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } }).single('file'), workspaceController.postCreateReply);// 3. 댓글 달기

//DELETE /v1/workspace/post/delete-reply/:channelId/:workSpaceId/:postId/:replyId
router.delete('/post/delete-reply/:channelId/:workSpaceId/:postId/:replyId', hasJsonWebToken, workspaceController.deleteReplyByCreatorInPost);// 3. 댓글 삭제

//PATCH /v1/workspace/post/edit-reply/:channelId/:workSpaceId
router.patch('/post/edit-reply/:channelId/:workSpaceId', hasJsonWebToken, multer({ storage: filesHandler.fileStorage, fileFilter: filesHandler.fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } }).single('file'), workspaceController.patchEditReplyByCreatorInPost);// 3. 댓글 수정

//PATCH /v1/workspace/invite/:channelId/:workSpaceId
router.patch('/invite/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.patchAddMemberToWorkSpace);// 4. 워크스페이스에 팀원 초대

//POST /v1/workspace/invite/:channelId/:workSpaceId
// router.patch('/invite/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.patchAddMemberToWorkSpace);// 5. 스크랩 따기

//GET /v1/workspace/:channelId/:workSpaceId/post/replies
router.post('/:channelId/:workSpaceId/post/replies', hasJsonWebToken, workspaceController.postGetPostDetailAndRepliesByPostId);// 6. 댓글 보기

//PATCH /v1/workspace/edit-comment/:channelId/:workSpaceId
router.patch('/edit-comment/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.patchEditComment);// 7. 워크스페이스 설명 코멘트 편집

//PATCH /v1/workspace/exit/:channelId/:workSpaceId
router.patch('/exit/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.patchExitWorkSpace);// 8. 워크스페이스 퇴장

// DELETE /v1/workspace/delete-post/:channelId/:workSpaceId/:postId
router.delete('/delete-post/:channelId/:workSpaceId/:postId', hasJsonWebToken, workspaceController.deletePostByCreatorInWorkSpace);// 9. 워크스페이스에서 해당 유저의 게시물 삭제

// PATCH /v1/workspace/edit-post/:channelId/:workSpaceId
router.patch('/edit-post/:channelId/:workSpaceId',
    hasJsonWebToken,
    multer({ storage: filesHandler.fileStorage, fileFilter: filesHandler.fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } }).array('files', 12),
    filesHandler.saveUploadedFiles,
    workspaceController.patchEditPostByCreatorInWorkSpace);// 10. 워크스페이스에서 해당 유저의 게시물 내용 수정

// GET /v1/workspace/file-list/:channelId/:workSpaceId
router.get('/file-list/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.getLoadFilesInWorkSpace);// 7. 채팅방 파일함 리스트 조회

export default router;