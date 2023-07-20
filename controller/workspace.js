import workspaceService from '../service/workspace.js';
import { hasReturnValue } from '../validator/valid.js';

/**
 * 1. 워크스페이스 세부정보 조회
 * 2. 자료 및 텍스트 내용 업로드
 * 3. 댓글 달기 -> 게시물이 있어야 함
 * 4. 워크스페이스에 팀원 초대
 * 5. 스크랩 따기
 * 6. 댓글 보기
 */
const workspaceController = {
    // 1. 워크스페이스 세부정보 로딩
    getLoadWorkspace: async (req, res, next) => {
        try {
            const data = await workspaceService.getLoadWorkspace(req.params.channelId, req.params.workSpaceId, req.userId, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                workSpace: data.workSpace
            });
        } catch (err) {
            next(err);
        }
    },
    // 2. 자료 및 텍스트 내용 업로드
    postUploadPost: async (req, res, next) => {
        try {
            const data = await workspaceService.postUploadPost(req.params.channelId, req.params.workSpaceId, req.userId, req.body, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                post: data.post
            });
        } catch (err) {
            next(err);
        }
    },
    // 3. 댓글 생성
    postCreateReply: async (req, res, next) => {
        try {
            const data = await workspaceService.postCreateReply(req.body.postId, req.userId, req.body.content, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                reply: data.reply
            });
        } catch (err) {
            next(err);
        }
    },
    // 4. 워크스페이스에 팀원 초대
    patchAddMemberToWorkSpace: async (req, res, next) => {
        try {
            const data = await workspaceService.patchAddMemberToWorkSpace(req.body.selectedId, req.params.channelId, req.params.workSpaceId, next);
            hasReturnValue(data);
            
            res.status(data.status.code).json({
                status: data.status,
                workSpace: data.workSpace
            })
        } catch (err) {
            next(err);
        }
    }
}

export default workspaceController