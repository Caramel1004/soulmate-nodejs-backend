import { Router } from 'express';
import multer from 'multer';

import { hasJsonWebToken, hasFile } from '../validator/valid.js';
import filesS3Handler from '../util/files-s3-handler.js';

import workspaceController from '../controller/workspace.js';

const router = Router();

/**
 * 1. 워크스페이스 세부정보 조회
 * 2. 게시물 생성
 * 3. 댓글 생성
 * 4. 댓글 삭제
 * 5. 댓글 수정
 * 6. 댓글 조회
 * 7. 워크스페이스에 팀원 초대
 * 8. 워크스페이스 설명 코멘트 편집
 * 9. 워크스페이스 퇴장
 * 10. 워크스페이스에서 해당 유저의 게시물 삭제
 * 11. 워크스페이스에서 해당 유저의 게시물 내용 수정
 * 12. 워크스페이스 파일 리스트 조회
 */


/** GET /api/v1/workspace/:channelId/:workspaceId
 * @method{GET}
 * @route {/api/v1/workspace/:channelId/:workspaceId}
 * 1. 워크스페이스 세부정보 조회
*/
router.get('/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.getLoadWorkspace);


/** POST /api/v1/workspace/create-post/:channelId/:workSpaceId
 * @method{POST}
 * @route {/api/v1/workspace/create-post/:channelId/:workSpaceId}
 * 2. 게시물 생성
*/
router.post('/create-post/:channelId/:workSpaceId',
    hasJsonWebToken,
    multer({ limits: { fieldSize: 25 * 1024 * 1024 } }).array('files', 12),
    hasFile,
    filesS3Handler.uploadFilesToS3,
    workspaceController.postCreatePost
);


/** POST /api/v1/workspace/post/create-reply/:channelId/:workSpaceId
 * @method{POST}
 * @route {/api/v1/workspace/post/create-reply/:channelId/:workSpaceId}
 * 3. 댓글 생성
*/
router.post('/post/create-reply/:channelId/:workSpaceId',
    hasJsonWebToken,
    multer({ limits: { fieldSize: 25 * 1024 * 1024 } }).single('file'),
    workspaceController.postCreateReply
);


/** DELETE /api/v1/workspace/post/delete-reply/:channelId/:workSpaceId/:postId/:replyId
 * @method{DELETE}
 * @route {/api/v1/workspace/post/delete-reply/:channelId/:workSpaceId/:postId/:replyId}
 * 4. 댓글 삭제
*/
router.delete('/post/delete-reply/:channelId/:workSpaceId/:postId/:replyId', hasJsonWebToken, workspaceController.deleteReplyByCreatorInPost);


/** PATCH /api/v1/workspace/post/edit-reply/:channelId/:workSpaceId
 * @method{PATCH}
 * @route {/api/v1/workspace/post/edit-reply/:channelId/:workSpaceId}
 * 5. 댓글 수정
*/
router.patch('/post/edit-reply/:channelId/:workSpaceId',
    hasJsonWebToken,
    multer({ limits: { fieldSize: 25 * 1024 * 1024 } }).single('file'),
    workspaceController.patchEditReplyByCreatorInPost
);


/** GET /api/v1/workspace/post/replies/:channelId/:workSpaceId/:postId
 * @method{GET}
 * @route {/api/v1/workspace/post/replies/:channelId/:workSpaceId/:postId}
 * 6. 댓글 조회
*/
router.get('/post/replies/:channelId/:workSpaceId/:postId', hasJsonWebToken, workspaceController.getPostDetailAndRepliesByPostId);


/** PATCH /api/v1/workspace/invite/:channelId/:workSpaceId
 * @method{PATCH}
 * @route {/api/v1/workspace/invite/:channelId/:workSpaceId}
 * 7. 워크스페이스에 팀원 초대
*/
router.patch('/invite/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.patchAddMemberToWorkSpace);



/** PATCH /api/v1/workspace/edit-comment/:channelId/:workSpaceId
 * @method{PATCH}
 * @route {/api/v1/workspace/edit-comment/:channelId/:workSpaceId}
 * 8. 워크스페이스 설명 코멘트 편집
*/
router.patch('/edit-comment/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.patchEditComment);


/** PATCH /api/v1/workspace/exit
 * @method{PATCH}
 * @route {/api/v1/workspace/exit}
 * 9. 워크스페이스 퇴장
*/
router.patch('/exit', hasJsonWebToken, workspaceController.patchExitWorkSpace);


/** DELETE /api/v1/workspace/delete-post/:channelId/:workSpaceId/:postId
 * @method{DELETE}
 * @route {/api/v1/workspace/delete-post/:channelId/:workSpaceId/:postId}
 * 10. 워크스페이스에서 해당 유저의 게시물 삭제
*/
router.delete('/delete-post/:channelId/:workSpaceId/:postId', hasJsonWebToken, workspaceController.deletePostByCreatorInWorkSpace);


/** PUT /api/v1/workspace/edit-post/:channelId/:workSpaceId
 * @method{PUT}
 * @route {/api/v1/workspace/edit-post/:channelId/:workSpaceId}
 * 11. 워크스페이스에서 해당 유저의 게시물 내용 수정
*/
router.put('/edit-post/:channelId/:workSpaceId',
    hasJsonWebToken,
    multer({ limits: { fieldSize: 25 * 1024 * 1024 } }).array('files', 12),
    filesS3Handler.uploadFilesToS3,
    workspaceController.putEditPostByCreatorInWorkSpace
);


/** GET /api/v1/workspace/file-list/:channelId/:workSpaceId
 * @method{GET}
 * @route {/api/v1/workspace/file-list/:channelId/:workSpaceId}
 * 12. 워크스페이스 파일 리스트 조회
*/
router.get('/file-list/:channelId/:workSpaceId', hasJsonWebToken, workspaceController.getLoadFilesInWorkSpace);

export default router;