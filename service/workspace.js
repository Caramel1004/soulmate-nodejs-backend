import Channel from '../models/channel.js';
import { WorkSpace } from '../models/workspace.js'

import { successType, errorType } from '../util/status.js';
import { hasArrayChannel, hasChannelDetail, hasUser, hasChatRoom, hasWorkSpace } from '../validator/valid.js';

/**
 * 1. 워크스페이스 세부정보 조회
 * 2. 작업물 업로드
 */
const workspaceService = {
    // 1. 워크스페이스 세부정보 조회
    getLoadWorkspace: async (channelId, workSpaceId, userId, next) => {
        try {
            /**1) 워크스페이스 세부 정보 조회 -> DB에서 발생한 에러는 catch문으로 처리
             * @params {objectId} channelId: 채널 아이디
             * @params {objectId} workSpaceId: 워크스페이스 아이디
             * @return {Object} - 워크스페이스 세부 정보
             * */
            const workSpace = await WorkSpace.findOne({
                _id: workSpaceId,
                channelId: channelId
            })
                .populate('users', {
                    _id: 1,
                    name: 1,
                    photo: 1
                })
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'creator',
                        select: {
                            _id: 1,
                            name: 1,
                            photo: 1,
                        }
                    }
                });

            console.log(workSpace);
            hasWorkSpace(workSpace);

            // 2) 워크스페이스에 속한 유저 목록중에 요청한 유저가 존재하는지 검사: 다른유저가 url타고 접속할수가 있기때문에 해당 유저가 없으면 접근 못하게 처리
            const workSpaceUser = workSpace.users.find(user => user._id.toString() === userId.toString());

            hasUser(workSpaceUser);

            return {
                status: successType.S02.s200,
                workSpace: workSpace
            }
        } catch (err) {
            next(err);
        }
    }
}

export default workspaceService