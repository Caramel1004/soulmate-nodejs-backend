import Channel from '../models/channel.js';
import { WorkSpace, Post, Reply } from '../models/workspace.js'

import { successType, errorType } from '../util/status.js';
import { hasArrayChannel, hasChannelDetail, hasUser, hasChatRoom, hasWorkSpace, hasPost } from '../validator/valid.js';

/**
 * 1. 워크스페이스 세부정보 조회
 * 2. 자료 및 텍스트 내용 업로드
 * 3. 댓글 달기
 * 4. 워크스페이스에 팀원 초대
 * 5. 스크랩 따기
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
    },
    // 2. 자료 및 텍스트 내용 업로드 == 게시물 생성
    postUploadPost: async (channelId, workSpaceId, userId, body, next) => {
        try {
            const post = await Post.create({
                content: body.content,
                fileUrl: body.fileUrl,
                creator: userId
            });
            hasPost(post);

            const workSpace = await WorkSpace.findOne({
                channelId: channelId,
                _id: workSpaceId
            })
                .select({
                    posts: 1
                });
            hasWorkSpace(workSpace);

            workSpace.posts.push(post._id);
            await workSpace.save();

            const resPost = await Post.findById(post._id)
            .populate('creator',{
                name: 1,
                photo: 1
            })

            return {
                status: successType.S02.s201,
                post: resPost
            }
        } catch (err) {
            next(err);
        }
    },
    // 3. 댓글 달기
    postCreateReply: async (postId, userId, content, next) => {
        try {
            const reply = await Reply.create({
                content: content,
                creator: userId
            });

            const post = await Post.findById(postId).select({ replies: 1 });
            post.replies.push(reply._id);
            await post.save();

            return {
                status: successType.S02.s201,
                reply: reply
            }
        } catch (err) {
            next(err)
        }
    },
    // 4. 워크스페이스에 팀원 초대
    patchAddMemberToWorkSpace: async (selectedId, channelId, workSpaceId, next) => {
        try {
            // 채널아이디로 해당 채팅룸이 있는지 부터 검사
            // 1. 채널 정보 가져오기
            const matchedChannel = await Channel.findById(channelId)
                .populate('workSpaces')
                .populate('members', {
                    _id: 1,
                    workSpaces: 1
                });

            hasChannelDetail(matchedChannel);

            
            // 2. 해당 워크스페이스 조회
            const matchedWorkSpace = matchedChannel.workSpaces.find(workSpace => workSpace._id.toString() === workSpaceId.toString());
            hasWorkSpace(matchedWorkSpace);

            // 필터 목록 1. 채널에 존재하나? 2. 워크스페이스에 중복되는 유저가 있나?
            // 채널에 멤버가 존재하는지 필터링 => 없으면 삭제 필터링
            const filterExistUserToChannel = selectedId.filter(selectedUser => {
                for (const existUser of matchedChannel.members) {
                    console.log(existUser);
                    if (selectedUser.toString() === existUser._id.toString()) {
                        console.log('채널에 존재');
                        return selectedUser;
                    }
                }
            });

            console.log(filterExistUserToChannel);
            // 워크스페이스에 중복되는 유저는 필터링
            const filterSelectedId = filterExistUserToChannel.filter(selectedUser => {
                for (const existUser of matchedWorkSpace.users) {
                    if (selectedUser.toString() === existUser.toString()) {
                        console.log('중복 => 해당 유저 pop');
                        return;
                    }
                }
                return selectedUser;
            })


            // 3. 워크스페이스 스키마에 선택된 유저 추가
            const updatedWorkSpaceUsers = [...matchedWorkSpace.users, ...filterSelectedId];
            matchedWorkSpace.users = [...updatedWorkSpaceUsers];
            await matchedWorkSpace.save();

            const status = successType.S02.s200;

            return {
                status: status,
                workSpace: matchedWorkSpace
            }
        } catch (err) {
            next(err);
        }
    }
}

export default workspaceService