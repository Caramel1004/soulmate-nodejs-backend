import Channel from '../models/channel.js';
import { WorkSpace, Post, Reply } from '../models/workspace.js'

import { successType, errorType } from '../util/status.js';
import { hasArrayChannel, hasChannelDetail, hasUser, hasChatRoom, hasWorkSpace, hasPost, hasReply } from '../validator/valid.js';

/**
 * 1. 워크스페이스 세부정보 조회
 * 2. 게시물 생성
 * 3. 댓글 달기 -> 게시물이 있어야 함
 * 4. 워크스페이스에 팀원 초대
 * 5. 스크랩 따기
 * 6. 댓글 보기
 * 7. 워크스페이스 설명 코멘트 편집
 * 8. 게시물 수정
 * 9. 댓글 수정
 * 10. 게시물 삭제
 * 11. 댓글 삭제
 */
const workspaceService = {
    // 1. 워크스페이스 세부정보 조회
    getLoadWorkspace: async (channelId, workSpaceId, sortType, sortNum, userId, next) => {
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
                    },
                    options: {
                        sort: {
                            createdAt: sortNum
                        }
                    }
                });

            hasWorkSpace(workSpace);

            // 왜 인지는 잘모르겠는데 map 안에서 루프 돌때 post객체안에 정보말고도 다른 프로퍼티들이 있음 그중 정보가 저장되있는 프로퍼티는 _doc
            workSpace.posts.map(post => {
                if (post.creator._id.toString() === userId.toString()) {
                    post._doc.isCreator = true;// 일치
                } else {
                    post._doc.isCreator = false;// 불일치
                }
                return post;
            });

            // 본인이 쓴 게시물 필터링
            if(sortType === 'creator'){
                console.log(sortType);
                workSpace.posts = workSpace.posts.filter(post => {
                    if (post._doc.isCreator) {
                        return post;
                    }
                });
            }

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
    postCreatePost: async (channelId, workSpaceId, userId, body, next) => {
        try {
            const post = await Post.create({
                content: body.content,
                fileUrls: body.fileUrls,
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
                .populate('creator', {
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
            console.log(postId);
            const reply = await Reply.create({
                content: content,
                creator: userId
            });

            const post = await Post.findById(postId).select({ replies: 1 });
            post.replies.push(reply._id);
            await post.save();

            const resReply = await Reply.findById(reply._id)
                .populate('creator', {
                    name: 1,
                    photo: 1
                })

            return {
                status: successType.S02.s201,
                reply: resReply
            }
        } catch (err) {
            next(err)
        }
    },
    deleteReplyByCreatorInPost: async (userId, channelId, workSpaceId, postId, replyId, next) => {
        try {
            // 1) 해당 워크스페이스 조회
            const workSpace = await WorkSpace.findOne({
                _id: workSpaceId,
                channelId: channelId
            })
                .select({ posts: 1 });

            hasWorkSpace(workSpace);
            hasPost(workSpace.posts.find(post => post.toString() === postId.toString()));// 워크스페이스 스키마에 posts컬럼에 게시물 존재하는지 판단

            // 2) 해당 게시물 조회
            const matchedPost = await Post.findById(postId)
                .select({
                    replies: 1
                });

            hasPost(matchedPost);

            hasReply(matchedPost.replies.includes(replyId.toString()));// 게시물에 해당 댓글 존재하는지 조회후 존재여부 판단

            const matchedReply = await Reply.findById(replyId)
                .select({
                    creator: 1
                })

            const matchedCreator = matchedReply.creator.toString() === userId.toString() ? matchedReply.creator : null;
            hasUser(matchedCreator);

            // 3) 해당 댓글 삭제
            const removedReply = await Reply.deleteOne({ _id: replyId });
            console.log(removedReply);

            // 4) 해당 게시물에 댓글 컬럼 필터링 -> 제거
            matchedPost.replies = [...matchedPost.replies.filter(reply => reply.toString() !== replyId.toString())];
            await matchedPost.save();
            return {
                status: successType.S02.s200,
                updatedPost: matchedPost
            }
        } catch (err) {
            next(err);
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
    },
    // 5. 스크랩 따기
    // 6. 댓글 보기
    postGetPostDetailAndRepliesByPostId: async (userId, postId, next) => {
        try {
            /**1) 게시물 세부 정보 조회 -> DB에서 발생한 에러는 catch문으로 처리
             * @params {objectId} postId: 채널 아이디
             * @return {Object} - 게시물 세부 정보
             * */
            const post = await Post.findOne({
                _id: postId
            })
                .populate('creator', {
                    name: 1,
                    photo: 1
                })
                .populate({
                    path: 'replies',
                    populate: {
                        path: 'creator',
                        select: 'name photo'
                    },
                    options: {
                        sort: {
                            createdAt: -1
                        }
                    }
                });

            // 왜 인지는 잘모르겠는데 map 안에서 루프 돌때 post객체안에 정보말고도 다른 프로퍼티들이 있음 그중 정보가 저장되있는 프로퍼티는 _doc
            const replyObjList = post.replies.map(reply => {
                if (reply.creator._id.toString() === userId.toString()) {
                    reply._doc.isCreator = true;// 일치
                } else {
                    reply._doc.isCreator = false;// 불일치
                }
                return reply;
            });

            return {
                status: successType.S02.s200,
                post: post
            };
        } catch (err) {
            next(err);
        }
    },
    // 7. 워크스페이스 설명 코멘트 편집
    patchEditComment: async (userId, channelId, workSpaceId, comment, next) => {
        try {
            /** 1) 현재 퇴장하려는 워크스페이스 조회
              * @params {ObjectId} 요청한 채널 아이디 
              * @params {ObjectId} 요청한 워크스페이스 아이디 
              * @return {object} (property)워크스페이스에 참여하고있는 유저들
              * */
            const matchedWorkSpace = await WorkSpace.findOne({
                _id: workSpaceId,
                channelId: channelId
            })
                .select({
                    comment: 1,
                    admins: 1,
                    creator: 1
                });

            hasWorkSpace(matchedWorkSpace);

            matchedWorkSpace.comment = comment;

            await matchedWorkSpace.save();

            return {
                status: successType.S02.s200
            }
        } catch (err) {
            next(err);
        }
    },
    // 8. 워크스페이스 퇴장
    patchExitWorkSpace: async (userId, channelId, workSpaceId, next) => {
        try {
            /** 1) 현재 퇴장하려는 워크스페이스 조회
              * @params {ObjectId} 요청한 채널 아이디 
              * @params {ObjectId} 요청한 워크스페이스 아이디 
              * @return {object} (property)워크스페이스에 참여하고있는 유저들
              * */
            const matchedWorkSpace = await WorkSpace.findOne({
                _id: workSpaceId,
                channelId: channelId
            })
                .select({
                    users: 1,
                })
                .populate('users', {
                    name: 1
                });

            hasWorkSpace(matchedWorkSpace);
            const exitUser = matchedWorkSpace.users.find(user => user._id.toString() === userId.toString())

            // 2) 워크스페이스 스키마에 해당 유저 필터링 -> 제거
            const filteredWorkSpaceUsers = matchedWorkSpace.users.filter(user => user._id.toString() !== userId.toString());
            console.log(matchedWorkSpace);

            if (filteredWorkSpaceUsers.length <= 0) {
                // 채널에서 해당 워크스페이스 제거
                const channel = await Channel.findById(channelId).select({ workSpaces: 1 });
                channel.workSpaces = [...channel.workSpaces.filter(workSpace => workSpace.toString() !== matchedWorkSpace._id.toString())];
                await channel.save();

                // 워크스페이스 스키마에서 해당 워크스페이스 삭제
                await WorkSpace.deleteOne({ _id: matchedWorkSpace._id });
            } else {
                matchedWorkSpace.users = [...filteredWorkSpaceUsers];
                await matchedWorkSpace.save();
            }

            return {
                status: successType.S02.s200,
                exitUser: exitUser
            }
        } catch (err) {
            next(err);
        }
    },
    // 9. 워크스페이스에서 해당 유저의 게시물 삭제
    deletePostByCreatorInWorkSpace: async (userId, channelId, workSpaceId, postId, next) => {
        try {
            // 1) 해당 게시물의 생성자와 삭제요청한 유저랑 일치하는지 확인
            const matchedPost = await Post.findById(postId)
                .select({
                    creator: 1
                })
                .populate('creator', {
                    _id: 1
                });

            hasPost(matchedPost);

            const user = matchedPost.creator._id.toString() === userId.toString() ? matchedPost.creator : null;
            hasUser(user);

            /** 2) 해당 게시물 삭제
              * @params {ObjectId} 요청한 게시물 아이디 
              * @return {object} (property)워크스페이스에 참여하고있는 유저들
              * */
            const removedPost = await Post.deleteOne({ _id: postId });

            // 3) 워크스페이스 스키마에 해당 게시물 필터링 -> 제거
            const workSpace = await WorkSpace.findOne({
                _id: workSpaceId,
                channelId: channelId
            })
                .select({ posts: 1 });
            workSpace.posts = [...workSpace.posts.filter(post => post.toString() !== removedPost._id.toString())];
            await workSpace.save();

            return {
                status: successType.S02.s200,
                removedPost: removedPost
            }
        } catch (err) {
            next(err);
        }
    },
    // 10. 워크스페이스에서 해당 유저의 게시물 내용 수정
    patchEditPostByCreatorInWorkSpace: async (userId, channelId, workSpaceId, body, next) => {
        try {
            const { postId, content } = body;
            /** 1) 해당 게시물의 생성자와 수정요청한 유저랑 일치하는지 확인
              * @params {ObjectId} 요청한 게시물 아이디 
              * @return {object} (property)워크스페이스에 참여하고있는 유저들
              * */
            const matchedPost = await Post.findById(postId)
                .select({
                    content: 1,
                    creator: 1
                })
                .populate('creator');

            hasPost(matchedPost);

            const user = matchedPost.creator._id.toString() === userId.toString() ? matchedPost.creator : null;
            hasUser(user);

            // 2) 수정된 게시물 내용 저장
            matchedPost.content = content;
            await matchedPost.save();

            return {
                status: successType.S02.s200,
                updatedPost: matchedPost
            }
        } catch (err) {
            next(err);
        }
    },
    // 10. 댓글 수정
    patchEditReplyByCreatorInPost: async (userId, channelId, workSpaceId, body, next) => {
        try {
            const { postId, replyId, content } = body;
            // 1) 해당 워크스페이스 조회
            const workSpace = await WorkSpace.findOne({
                _id: workSpaceId,
                channelId: channelId
            })
                .select({ posts: 1 });

            hasWorkSpace(workSpace);
            hasPost(workSpace.posts.find(post => post.toString() === postId.toString()));// 워크스페이스 스키마에 posts컬럼에 게시물 존재하는지 판단

            // 2) 해당 게시물 조회
            const matchedPost = await Post.findById(postId)
                .select({
                    replies: 1
                });

            hasPost(matchedPost);

            hasReply(matchedPost.replies.includes(replyId.toString()));// 게시물에 해당 댓글 존재하는지 조회후 존재여부 판단

            const matchedReply = await Reply.findById(replyId)
                .select({
                    creator: 1,
                    content: 1
                })

            const matchedCreator = matchedReply.creator.toString() === userId.toString() ? matchedReply.creator : null;
            hasUser(matchedCreator);

            // 3) 해당 댓글 수정
            matchedReply.content = content;
            await matchedReply.save();
            console.log(matchedReply);

            return {
                status: successType.S02.s200,
                updatedReply: matchedReply
            }
        } catch (err) {
            next(err);
        }
    }
}

export default workspaceService