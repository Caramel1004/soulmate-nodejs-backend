import workspaceService from '../service/workspace.js';
import { hasReturnValue } from '../validator/valid.js';
import SocketIO from '../socket.js';

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
const workspaceController = {
    // 1. 워크스페이스 세부정보 로딩
    getLoadWorkspace: async (req, res, next) => {
        try {
            console.log(req.query)
            const { userId, authStatus } = req.user
            const { channelId, workSpaceId } = req.params;
            const { sortType, sortNum } = req.query;
            const data = await workspaceService.getLoadWorkspace(channelId, workSpaceId, sortType, sortNum, userId, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                authStatus: authStatus,
                status: data.status,
                workSpace: data.workSpace
            });
        } catch (err) {
            next(err);
        }
    },
    // 2. 게시물 생성
    postCreatePost: async (req, res, next) => {
        try {
            const { userId, authStatus } = req.user
            const data = await workspaceService.postCreatePost(req.params.channelId, req.params.workSpaceId, userId, req.body, next);

            hasReturnValue(data);

            // 웹 소켓: 워크스페이스에 속한 모든 유저의 게시물 내용 업로드
            const serverIO = SocketIO.getSocketIO();
            serverIO.emit('uploadPost', {
                status: data.status,
                post: data.post
            });

            res.status(data.status.code).json({
                authStatus: authStatus,
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

            // 웹 소켓: 워크스페이스에 속한 모든 유저의 게시물 내용 업로드
            const serverIO = SocketIO.getSocketIO();
            serverIO.emit('createReply', {
                status: data.status,
                reply: data.reply
            });

            res.status(data.status.code).json({
                status: data.status,
                reply: data.reply
            });
        } catch (err) {
            next(err);
        }
    },
    // 댓글 삭제
    deleteReplyByCreatorInPost: async (req, res, next) => {
        try {
            const { userId } = req;
            const { channelId, workSpaceId, postId, replyId } = req.params;

            const data = await workspaceService.deleteReplyByCreatorInPost(userId, channelId, workSpaceId, postId, replyId, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                updatedPost: data.updatedPost
            });
        } catch (err) {
            next(err);
        }
    },
    // 4. 워크스페이스에 팀원 초대
    patchAddMemberToWorkSpace: async (req, res, next) => {
        try {
            console.log(req.body);
            const data = await workspaceService.patchAddMemberToWorkSpace(req.body.selectedId, req.params.channelId, req.params.workSpaceId, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                workSpace: data.workSpace
            })
        } catch (err) {
            next(err);
        }
    },
    // 5. 스크랩 따기
    // 6. 댓글 보기
    postGetPostDetailAndRepliesByPostId: async (req, res, next) => {
        try {
            const data = await workspaceService.postGetPostDetailAndRepliesByPostId(req.userId, req.body.postId, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                post: data.post
            });
        } catch (err) {
            next(err);
        }
    },
    // 7. 워크스페이스 설명 코멘트 편집
    patchEditComment: async (req, res, next) => {
        try {
            const data = await workspaceService.patchEditComment(req.userId, req.body.channelId, req.body.workSpaceId, req.body.comment, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status
            });
        } catch (err) {
            next(err);
        }
    },
    // 8. 워크스페이스 퇴장
    patchExitWorkSpace: async (req, res, next) => {
        try {
            const data = await workspaceService.patchExitWorkSpace(req.userId, req.body.channelId, req.body.workSpaceId, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                exitUser: data.exitUser
            });
        } catch (err) {
            next(err);
        }
    },
    // 9. 워크스페이스에서 해당 유저의 게시물 삭제
    deletePostByCreatorInWorkSpace: async (req, res, next) => {
        try {
            const data = await workspaceService.deletePostByCreatorInWorkSpace(req.userId, req.params.channelId, req.params.workSpaceId, req.params.postId, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                removedPost: data.removedPost
            });
        } catch (err) {
            next(err);
        }
    },
    // 10. 워크스페이스에서 해당 유저의 게시물 내용 수정
    patchEditPostByCreatorInWorkSpace: async (req, res, next) => {
        try {
            const { userId } = req;
            const { channelId, workSpaceId } = req.params;
            const { body } = req;
            const data = await workspaceService.patchEditPostByCreatorInWorkSpace(userId, channelId, workSpaceId, body, next);
            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
            });
        } catch (err) {
            next(err);
        }
    },
    // 11. 워크스페이스에서 해당 유저의 게시물 내용 수정
    patchEditReplyByCreatorInPost: async (req, res, next) => {
        try {
            const { userId } = req;
            const { channelId, workSpaceId } = req.params;
            const { body } = req;

            const data = await workspaceService.patchEditReplyByCreatorInPost(userId, channelId, workSpaceId, body, next);

            hasReturnValue(data);

            res.status(data.status.code).json({
                status: data.status,
                updatedReply: data.updatedReply
            });
        } catch (err) {
            next(err);
        }
    }
}

export default workspaceController