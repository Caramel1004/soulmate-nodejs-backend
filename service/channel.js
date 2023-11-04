import Channel from '../models/channel.js';
import { Feed } from '../models/feed.js';
import { User } from '../models/user.js';
import { ChatRoom } from '../models/chat-room.js';
import { WorkSpace } from '../models/workspace.js';

import { successType } from '../util/status.js';
import { hasArrayChannel, hasChannelDetail, hasUser, hasChatRoom, hasExistUserInChannel, hasWorkSpace, hasExistWishChannel, hasFeed } from '../validator/valid.js';
import channel from '../models/channel.js';

/**
* 함수 목록
* # 채널 입장 전
* 1. 생성된 오픈 채널 목록 조회
*      1-1. 오픈 채널 박스 클릭 -> 오픈 채널 세부 정보 조회
*      1-2. 오픈 채널 찜 클릭 -> 관심채널에 추가
* 2. 해당 유저의 채널 리스트 조회
*      내가만든 채널, 초대 받은 채널, 오픈 채널 -> 필터
*      2-1. 업무(비공개) 채널 조회
*      2-2. 초대 받은 채널
*      2-3. 오픈 채널 조회
* 3. 채널 생성s
* 4. 관심 채널 조회 
* 5. 관심 채널 삭제 -> 함수 통합시킴
* 
* #채널 입장 후
* 1. 채널아이디로 해당 채널 조회 -> 채널 세부페이지
*      1-1. 채널에 팀원 초대
*      1-2. 채널 세부정보
*      1-3. 채널 퇴장
* 2. 워크스페이스 목록 조회
*      2-1. 워크 스페이스 목록중 하나 클릭 -> 세부정보 로딩
*      2-2. 게시물 로딩
* 3. 채팅방 목록 조회
*      3-1. 채팅 방 입장 -> 채팅 히스토리 로딩
* 4. 채팅룸 생성
* 5. 채널 관리 - 공개로 전환 비공개로 전환
*/

const channelService = {
    // 1. 생성된 오픈 채널 목록 조회
    getOpenChannelList: async next => {
        try {
            // 1) 오픈채널 조회 -> return: 채널아이디를 담은 배열
            const channels = await Channel.find({
                open: 'Y'
            })
                .select({
                    _id: 1,
                    channelName: 1,
                    thumbnail: 1,
                    category: 1,
                });

            // 에러: 채널을 담는 배열이 존재하지않으면 에러
            hasArrayChannel(channels);

            const status = successType.S02.s200;
            return {
                status: status,
                channels: channels
            }
        } catch (err) {
            next(err);
        }
    },
    /** 1-1. 오픈 채널 세부 정보 조회
     * @params {objectId} channelId: 채널 아이디
     * @params {function} next: 다음 미들웨어 실행 함수
     * @return {Object} (property) status: {code 상태코드, status 상태, msg 상태메시지}: http 상태 보고서
     * @property {object} status - 상태
     * @property {string} content - 할일 내용
     * @property {boolean} completed - 할일 완료 여부
    */
    getOpenChannelDetail: async (channelId, next) => {
        try {
            /**1) 채널 세부 정보 조회 -> DB에서 발생한 에러는 catch문으로 처리
             * @params {objectId} channelId: 채널 아이디
             * @params {string} open: 공개 여부
             * @return {Object} - 채널 세부 정보
             * */
            const channelDetail = await Channel.findOne({
                _id: channelId,
                open: 'Y'
            },
                {
                    channelName: 1,
                    owner: 1,
                    thumbnail: 1,
                    category: 1,
                    comment: 1,
                    members: 1
                })
                .populate('members', {
                    name: 1,
                    photo: 1
                })

            // 에러: 해당아이디 조회 했을때, 채널이 존재하지 않으면 에러처리 -> DB문제
            hasChannelDetail(channelDetail);

            const status = successType.S02.s200;

            return {
                status: status,
                channelDetail: channelDetail
            }
        } catch (err) {
            console.log('err:', err);
            next(err);
        }
    },
    /** 1-2. 오픈 채널 찜 클릭 -> 관심채널에 추가
     * @params {ObjectId} channelId: 채널 아이디
     * @params {ObjectId} userId: 요청한 유저 아이디
     * @params {function} next: 다음 미들웨어 실행 함수
     * @return {Object} (property) status: {code 상태코드, status 상태, msg 상태메시지}: http 상태 보고서
    */
    patchAddOrRemoveWishChannel: async (channelId, userId, next) => {
        try {
            let action;
            // 1) 해당 채널이 존재하면서 공개 채널인 채널 조회 -> 데이터가 존재하는지 확인
            const openChannel = await Channel.findOne({
                _id: channelId,
                open: 'Y'
            },
                {
                    _id: 1,
                    open: 1
                });

            // 에러: 해당아이디 조회 했을때, 채널이 존재하지 않으면 에러처리 -> DB문제
            hasChannelDetail(openChannel);

            /** 2) 유저의 위시채널 목록 조회
             * @params {ObjectId} 요청한 유저 아이디 
             * @return {object} (property)매칭된 유저의 관심채널 배열
             * */
            const matchedUser = await User.findById(userId).select({ wishChannels: 1 });
            // 에러: 매칭된 유저가 존재하지 않을때 에러 처리
            hasUser(matchedUser);

            // 3) 유저 위시채널리스트에 요청온 위시채널이 있는지 체크 -> 있으면 삭제 없으면 추가(토글)
            const wishChannel = matchedUser.wishChannels.find(id => id.toString() === openChannel._id.toString());

            if (!wishChannel) {
                // 4) 관심 채널 배열에 푸쉬
                matchedUser.wishChannels.push(channelId);
                action = 'add';
            } else {
                // 4) 제거하려는 채널아이디만 제외하고 나머지 요소들만 배열로 반환
                matchedUser.wishChannels = [...matchedUser.wishChannels.filter(id => id.toString() !== channelId.toString())];
                action = 'remove';
            }

            // 5) 수정된 데이터 저장 -> DB에서 발생한 에러는 catch문으로 처리
            const savedUser = await matchedUser.save();

            // 에러: 저장된 유저가 없을때 에러 처리
            hasUser(savedUser);

            const status = successType.S02.s200;

            return {
                status: status,
                action: action
            };
        } catch (err) {
            next(err);
        }
    },
    /** 1-3. 채널 퇴장
     * @params {ObjectId} channelId: 채널 아이디
     * @params {ObjectId} userId: 요청한 유저 아이디
     * @params {function} next: 다음 미들웨어 실행 함수
     * @return {Object} (property) status: {code 상태코드, status 상태, msg 상태메시지}: http 상태 보고서
    */
    patchExitChannel: async (userId, channelId, next) => {
        try {
            const matchedChannel = await Channel.findById(channelId);

            const updatedUsers = matchedChannel.members.filter(id => id.toString() !== userId.toString());

            if (updatedUsers.length <= 0) {
                await Channel.deleteOne({ _id: channelId });
            } else {
                matchedChannel.members = [...updatedUsers];

                console.log('updatedUsers: ', updatedUsers);
                await matchedChannel.save();
            }

            // 2. 유저스키마에서 해당 채널 삭제
            const exitedUser = await User.findById(userId);
            const updatedChannels = exitedUser.channels.filter(id => id.toString() !== channelId.toString());

            exitedUser.channels = [...updatedChannels];
            await exitedUser.save();

            return {
                status: successType.S02.s200,
                exitedUser: exitedUser
            }
        } catch (err) {
            next(err);
        }
    },
    /** 2. 해당 유저의 채널 리스트 조회
     * @params {ObjectId} userId: 요청한 유저 아이디
     * @params {string} searchWord: 검색 키워드
     * @params {function} next: 다음 미들웨어 실행 함수
     * @return {Object} (property) status: {code 상태코드, status 상태, msg 상태메시지}: http 상태 보고서
     * @return {Object} (property) channels
    */
    getChannelListByUserId: async (userId, searchWord, next) => {
        try {
            // 분류 목록: 업무(비공개)팀플레이 채널, 내가만든 채널, 초대 받은 채널, 오픈 채널 -> 필터
            const user = await User.findById(userId)
                .populate('channels', {
                    open: 1,
                    owner: 1,
                    channelName: 1,
                    thumbnail: 1,
                    category: 1,
                    members: 1
                });//populate함수로 해당아이디에대한 채널정보 모두 가져오기

            hasUser(user);

            let filteredChannels;

            // 쿼리스트링 - searchWord
            switch (searchWord) {
                case 'own':
                    // 해당 유저가 생성한 채널
                    filteredChannels = user.channels.filter(channel => channel.owner.toString() === userId.toString());
                    break;
                case 'invite':
                    // 해당 유저가 참여하고있는 채널 
                    filteredChannels = user.channels.filter(channel => channel.owner !== userId.toString());
                    break;
                case 'work':
                    // 작업 채널
                    filteredChannels = user.channels.filter(channel => channel.open.toString() == 'N');
                    break;
                case 'open':
                    // 오픈 채널
                    filteredChannels = user.channels.filter(channel => channel.open.toString() == 'Y');
                    break;
                default:
                    // 모든 채널
                    filteredChannels = user.channels;
                    break;
            }

            const status = successType.S02.s200;
            return {
                status: status,
                channels: filteredChannels
            };
        } catch (err) {
            next(err);
        }
    },
    // 3. 채널 생성
    postCreateChannel: async (body, next) => {
        try {
            // 1. 채널추가 요청한 유저의 아이디에 의한 데이터 조회
            const matchedUser = await User.findById(body.userId);

            if (body.thumbnail === '') {
                body.thumbnail = '/images/android-chrome-192x192.png';
            }

            // 2. 채널 추가 요청한 유저가 오너
            const owner = matchedUser._id;

            body.owner = owner;
            body.members = [];
            body.members.push(matchedUser._id);

            // 인스턴스 생성
            const channel = new Channel(body);

            // 3. 요청된 채널 정보 저장
            const createChannel = await channel.save();

            // 4. 해당 유저의 채널리스트에 채널아이디 추가
            matchedUser.channels.push(createChannel._id);
            await matchedUser.save();

            return {
                status: successType.S02.s201,
                channelId: createChannel._id
            };
        } catch (err) {
            next(err);
        }
    },
    // 4. 관심 채널 조회 
    getWishChannelList: async (userId, category, searchWord, next) => {
        try {
            let condition;
            console.log(searchWord)
            console.log(category)
            // 1. 카테고리 + 서치워드
            if (category != undefined && searchWord != undefined) {
                condition = {
                    open: 'Y',
                    channelName: {
                        $regex: searchWord,
                        $options: 'i'
                    },
                    category: {
                        $in: [category]
                    }
                }
            } else if (category != undefined && searchWord == undefined) {
                condition = {
                    open: 'Y',
                    category: {
                        $in: [category]
                    }
                }
            } else if (category == undefined && searchWord != undefined) {
                condition = {
                    open: 'Y',
                    channelName: {
                        $regex: searchWord,
                        $options: 'i'
                    }
                }
            } else if (category == undefined && searchWord == undefined) {
                condition = {
                    open: 'Y'
                }
            }
            console.log(condition)
            const user = await User.findOne()
                .where('_id').equals(userId)
                .select({
                    wishChannels: 1
                })
                .populate({
                    path: 'wishChannels',
                    select: {
                        open: 1,
                        channelName: 1,
                        thumbnail: 1,
                        category: 1,
                        comment: 1,
                        members: 1
                    },
                    match: condition,
                    populate: { path: 'members', select: 'name photo' }
                });

            // const user = await User.findById(userId).select({wishChannels:1}).populate('wishChannels');
            const wishChannels = user.wishChannels;

            if (!wishChannels) {
                user.wishChannels = [];
            }

            return {
                status: successType.S02.s200,
                wishChannels: wishChannels
            }
        } catch (err) {
            next(err);
        }
    },
    // 5. 관심 채널 삭제 -> 함수 통합시킴
    // 6. 채널아이디로 해당 채널 조회
    getChannelDetailByChannelId: async (userId, channelId, next) => {
        try {
            // 1. 유저가 해당 채널의 아이디를 가지고 있는지 부터 체크 
            const user = await User.findById(userId).select({ channels: 1 }).populate('channels');

            const matchedChannel = user.channels.find(channel => channel._id.toString() === channelId.toString());

            hasChannelDetail(matchedChannel);

            // 2. 유저가 해당 채널의 아이디를 가지고있으면 다음 채널아이디로 해당채널 조회
            const channel = await Channel.findById(matchedChannel._id)
                .populate('members', {
                    name: 1,
                    photo: 1
                })
                .populate({
                    path: 'feeds',
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

            hasChannelDetail(channel);

            // 왜 인지는 잘모르겠는데 map 안에서 루프 돌때 post객체안에 정보말고도 다른 프로퍼티들이 있음 그중 정보가 저장되있는 프로퍼티는 _doc
            channel.feeds.map(feed => {
                if (feed.creator._id.toString() === userId.toString()) {
                    feed._doc.isCreator = true;// 일치
                } else {
                    feed._doc.isCreator = false;// 불일치
                }
                return feed;
            });

            return {
                status: successType.S02.s200,
                channel: channel
            }
        } catch (err) {
            next(err);
        }
    },
    // 6-1. 해당채널에 유저 초대
    patchInviteUserToChannel: async (channelId, selectedIds, next) => {
        try {
            const matchedChannel = await Channel.findById(channelId).select({ members: 1 });

            // 채널에 멤버가 존재하면 필터링 => 있으면 삭제 필터링 => 없는 사람만 배열에 남기기
            const notExistUsersToChannel = selectedIds.filter(selectedId => {
                console.log(selectedId);
                for (const existUser of matchedChannel.members) {
                    console.log(existUser);
                    if (selectedId.toString() === existUser.toString()) {
                        return;
                    }
                }
                return selectedId;
            });

            console.log(notExistUsersToChannel);

            matchedChannel.members = [...notExistUsersToChannel, ...matchedChannel.members];
            await matchedChannel.save();

            // 비교연산자 사용 $in -> 첫번쨰 조건인수
            // 배열인 프로퍼티에 값 넣기 $push -> 두번째 업데이트할 document
            // user를 조회하지 읺고 바로 조건에 맞는 데이터를 업데이트
            const users = await User.updateMany({
                _id: {
                    $in: notExistUsersToChannel
                }
            },
                {
                    $push: {
                        channels: channelId
                    }
                }
            );

            return {
                status: successType.S02.s200,
                channel: matchedChannel,
                users: users
            }
        } catch (err) {
            next(err);
        }
    },
    // 8. 채팅방 목록 조회
    getChatRoomListByChannelAndUserId: async (userId, channelId, searchWord, next) => {
        try {
            /** 1) 채널아이디와 매칭된 채팅방 목록 조회
             * @params {ObjectId} 요청한 채널 아이디 
             * @return {Array} 매칭된 채널이 보유하고있는 채팅방 목록
             * */
            const chatRoomList = await ChatRoom.find({
                channelId: channelId,
                roomName: {
                    $regex: searchWord,
                    $options: 'i'
                }
            },
                {
                    channelId: 1,
                    roomName: 1,
                    users: 1,
                    chats: 1
                })
                .populate('users', {
                    photo: 1
                })
                .populate({
                    path: 'chats',
                    options: {
                        sort: {
                            createdAt: -1
                        }
                    }
                });

            const userChatRooms = chatRoomList.filter(chatRoom => {
                const hasChatRoom = chatRoom.users.find(user => user._id.toString() === userId.toString());
                if (hasChatRoom) {
                    return chatRoom;
                }
            });
            return {
                status: successType.S02.s200,
                chatRooms: userChatRooms
            }
        } catch (err) {
            next(err);
        }
    },
    // 9. 채팅룸 생성
    postCreateChatRoom: async (channelId, userId, roomName, next) => {
        try {
            const chatRoom = new ChatRoom({
                channelId: channelId,
                roomName: roomName,
                users: [userId]
            });

            // 1. 채팅방 생성
            const createdChatRoom = await chatRoom.save();

            hasChatRoom(createdChatRoom);

            // 2. 해당 채널스키마에 채팅룸 컬럼에 채팅룸 아이디 푸쉬 후 저장 
            const channel = await Channel.findById(createdChatRoom.channelId).select({ chatRooms: 1 });
            channel.chatRooms.push(createdChatRoom._id);
            await channel.save();

            return {
                status: successType.S02.s201,
                chatRoom: createdChatRoom
            }
        } catch (err) {
            next(err);
        }
    },
    // 10. 워크스페이스 생성
    postCreateWorkSpace: async (channelId, reqUserId, body, next) => {
        try {
            body.channelId = channelId;
            body.users = [reqUserId];
            body.admins = [reqUserId];
            body.creator = reqUserId;
            // 1. 워크스페이스 생성
            const workSpace = await WorkSpace.create(body);

            hasWorkSpace(workSpace);

            // 2. 요청을 보낸 채널에 워크스페이스 추가
            const channel = await Channel.findById(channelId).select({ workSpaces: 1 });

            channel.workSpaces.push(workSpace._id);
            await channel.save();

            return {
                status: successType.S02.s201,
                workSpace: workSpace
            }
        } catch (err) {
            console.log(err);
            next(err);
        }
    },
    // 11. 워크스페이스 목록 조회
    getWorkSpaceListByChannelIdAndUserId: async (channelId, searchWord, userId, next) => {
        try {
            console.log(searchWord);
            const workSpaceList = await WorkSpace.find({
                channelId: channelId,
                workSpaceName: {
                    $regex: searchWord,
                    $options: 'i'
                }
            })
                .select({
                    _id: 1,
                    channelId: 1,
                    open: 1,
                    workSpaceName: 1,
                    users: 1,
                    posts: 1,
                    createdAt: 1
                })
                .populate('users', {
                    photo: 1
                })
                .populate({
                    path: 'posts',
                    options: {
                        sort: {
                            createdAt: -1
                        },
                        limit: 2
                    },
                    populate: {
                        path: 'creator',
                        select: 'name'
                    }
                });
            const userWorkSpaces = workSpaceList.filter(workSpace => {
                const hasWorkSpace = workSpace.users.find(user => user._id.toString() === userId.toString());
                if (hasWorkSpace) {
                    return workSpace;
                }
            });

            const openWorkSpaces = workSpaceList.filter(workSpace => workSpace.open == 'Y' || workSpace.open == 'true');

            return {
                status: successType.S02.s200,
                workSpaces: userWorkSpaces,
                openWorkSpaces: openWorkSpaces
            }
        } catch (err) {
            next(err);
        }
    },
    postCreateFeedToChannel: async (userId, channelId, title, content, imageUrls, next) => {
        try {
            // 1. 피드스키마에 피드 저장
            const feed = await Feed.create({
                channelId: channelId,
                title: title,
                content: content,
                imageUrls: imageUrls,
                creator: userId
            });
            hasFeed(feed);

            // 2. 해당 채널아이디 채널 조회
            const channel = await Channel.findById(channelId)
                .select({ feeds: 1, members: 1 })
                .populate('members', {
                    name: 1,
                    photo: 1
                });
            hasChannelDetail(channel);

            // 3. 피드 배열에 푸쉬
            channel.feeds.push(feed._id);

            //4. 채널 저장
            await channel.save();

            // 5. 채널멤버와 크리에이터 매칭
            const creatorObj = channel.members.find(member => member._id.toString() === feed.creator.toString());
            feed._doc.creator = creatorObj;
            return {
                status: successType.S02.s200,
                feed: feed
            }
        } catch (err) {
            next(err);
        }
    },
    patchEditFeedToChannel: async (userId, channelId, feedId, title, content, fileUrls, next) => {
        try {
            const matchedFeed = await Feed.findOne({
                _id: feedId,
                channelId: channelId,
                creator: userId
            },
                {
                    title: 1,
                    content: 1,
                    imageUrls: 1,
                    creator: 1
                });
            hasFeed(matchedFeed);

            matchedFeed.title = title;
            matchedFeed.content = content;
            matchedFeed.imageUrls = [...fileUrls];

            console.log(matchedFeed);

            await matchedFeed.save();

            return {
                status: successType.S02.s200,
                feed: matchedFeed
            }
        } catch (err) {
            next(err);
        }
    },
    patchPlusOrMinusNumberOfLikeInFeed: async (userId, channelId, feedId, next) => {
        try {
            // 1. 유저 존재 여부
            const hasUserData = await User.exists({ _id: userId });
            hasUser(hasUserData);

            // channelSchema -> feedSchema
            // 2. 채널 조회
            const channel = await Channel.findOne({
                _id: channelId
            })
                .select({
                    feeds: 1
                })
                .populate({
                    path: 'feeds',
                    match: {
                        _id: feedId
                    },
                    select: 'likes'
                })
            hasChannelDetail(channel);

            const hasUserInFeedLikes = channel.feeds[0].likes.includes(userId.toString());

            const feed = await Feed.findOne({
                channelId: channel._id,
                _id: channel.feeds[0]._id
            })
                .select({
                    likes: 1
                })

            if (!hasUserInFeedLikes) {// 피드 좋아요 배열에 유저없으면 배열에 푸쉬
                feed.likes.push(userId);
            } else {// 피드 좋아요 배열에 유저 있으면 배열에서 삭제(필터링)
                feed.likes = [...feed.likes.filter(like => like.toString() !== userId.toString())];
            }

            await feed.save();

            return {
                status: successType.S02.s200,
                numberOfLikeInFeed: feed.likes.length
            }
        } catch (err) {
            next(err);
        }
    },
    getSearchOpenChannelListBySearchKeyWord: async (category, searchWord, next) => {
        try {
            let condition;
            // 1. 카테고리 + 서치워드
            if (category != undefined && searchWord != '') {
                condition = {
                    open: 'Y',
                    channelName: {
                        $regex: searchWord,
                        $options: 'i'
                    },
                    category: {
                        $in: [category]
                    }
                }
            } else if (category != undefined && searchWord == '') {
                condition = {
                    open: 'Y',
                    category: {
                        $in: [category]
                    }
                }
            } else if (category == undefined && searchWord != '') {
                condition = {
                    open: 'Y',
                    channelName: {
                        $regex: searchWord,
                        $options: 'i'
                    }
                }
            } else if (category == undefined && searchWord == '') {
                condition = {
                    open: 'Y'
                }
            }
            // 2. 카테고리
            const channels = await Channel.find(condition)
                .select({
                    channelName: 1,
                    thumbnail: 1,
                    category: 1,
                    members: 1
                });

            // 에러: 채널을 담는 배열이 존재하지않으면 에러
            hasArrayChannel(channels);

            return {
                status: successType.S02.s200,
                channels: channels
            }
        } catch (err) {
            next(err);
        }
    }
}

export default channelService;