import workspaceService from '../service/workspace.js';
import { hasReturnValue } from '../validator/valid.js';

/**
 * 1. 워크스페이스 세부정보 조회
 * 2. 작업물 업로드
 */
const workspaceController = {
    // 1. 워크스페이스 세부정보 로딩
    getLoadWorkspace: async (req, res, next) => {
        try {
            const data = await workspaceService.getLoadWorkspace(req.params.channelId, req.params.workSpaceId, req.userId, next);

            hasReturnValue(data);
            console.log(data.status);
            res.status(data.status.code).json({
                status: data.status,
                workSpace: data.workSpace
            });
        } catch (err) {
            next(err);
        }
    }
}

export default workspaceController