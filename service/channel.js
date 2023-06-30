import Channel from '../models/channel.js';
import User from '../models/user.js';
import { ChatRoom } from '../models/chat-room.js';

import { successType, errorType } from '../util/status.js';
import { hasChannelDetail, hasUser } from '../validator/valid.js';
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
* 3. 채널 생성
* 4. 관심 채널 조회 
* 5. 관심 채널 삭제
* 
* #채널 입장 후
* 1. 채널아이디로 해당 채널 조회 -> 채널 세부페이지
*      1-1. 채널에 팀원 초대
*      1-2. 채널 세부정보
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
    patchAddOpenChannelToWishChannel: async (channelId, userId, next) => {
        try {
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

            // 3) 관심 채널 배열에 푸쉬
            matchedUser.wishChannels.push(channelId);

            // 4) 수정된 데이터 저장 -> DB에서 발생한 에러는 catch문으로 처리
            const savedUser = await matchedUser.save();

            // 에러: 저장된 유저가 없을때 에러 처리
            hasUser(savedUser);

            const status = successType.S02.s200;

            return {
                status: status,
                user: savedUser
            };
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
                    channelName: 1,
                    thumbnail: 1,
                    category: 1
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
                    filteredChannels = user.channels.filter(channel => channel.owner.toString() !== userId.toString());
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
    postCreateChannel: async body => {
        try {
            console.log('service => body: ', body);
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

            return successType.S02.s201;
        } catch (err) {
            next(err);
        }
    },
    // 4. 관심 채널 조회 
    getWishChannelList: async (userId, next) => {
        try {
            const user = await User.findOne()
                .where('_id').equals(userId)
                .select({
                    wishChannels: 1
                })
                .populate('wishChannels', {
                    open: 1,
                    channelName: 1,
                    thumbnail: 1,
                    category: 1,
                    comment: 1,
                    members: 1
                })
                .populate({
                    path: 'wishChannels',
                    populate: { path: 'members', select: 'name photo' }
                });

            // const user = await User.findById(userId).select({wishChannels:1}).populate('wishChannels');
            const wishChannels = user.wishChannels;

            console.log(wishChannels);

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
    // 5. 관심 채널 삭제
    patchRemoveOpenChannelToWishChannel: async (userId, channelId, next) => {
        try {
            /** 1) 유저의 위시채널 목록 조회
             * @params {ObjectId} 요청한 유저 아이디 
             * @return {object} (property)매칭된 유저의 관심채널 배열
             * */
            const matchedUser = await User.findOne({ _id: userId }, { wishChannels: 1 });
            console.log('matchedUser: ', matchedUser);

            // 에러: 매칭된 유저가 존재하지 않을때 에러 처리
            hasUser(matchedUser);

            // 2) 제거하려는 채널아이디만 제외하고 나머지 요소들만 배열로 반환
            matchedUser.wishChannels = [...matchedUser.wishChannels.filter(id => id.toString() !== channelId.toString())];
            
            // 3) 수정된 유저 저장
            const updatedUser = await matchedUser.save();

            // 에러: 저장된 유저가 없을때 에러 처리
            hasUser(updatedUser);

            return {
                status: successType.S02.s200,
                updatedUser: updatedUser
            }
        } catch (err) {
            next(err);
        }
    }
}

export default channelService;