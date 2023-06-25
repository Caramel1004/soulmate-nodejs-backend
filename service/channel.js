import Channel from '../models/channel.js';
import User from '../models/user.js';
import { ChatRoom } from '../models/chat-room.js';

import { successType, errorType } from '../util/status.js';
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
*/

const channelService = {
    // 1. 생성된 오픈 채널 목록 조회
    getOpenChannelList: async () => {
        try {
            // 1. 오픈채널 조회 -> 배열
            const channels = await Channel.find({
                open: 'Y'
            })
                .select({
                    _id: 1,
                    channelName: 1,
                    thumbnail: 1,
                    category: 1,
                });
            // 에러: DB 에러
            if (!channels) {
                const errReport = errorType.D04.d404;
                const error = new Error(errReport);
                throw error;
            }
            const status = successType.S02.s200;
            return {
                status: status,
                channels: channels
            }
        } catch (err) {
            throw err;
        }
    },
    // 1-1. 오픈 채널 세부 정보 조회
    getOpenChannelDetail: async channelId => {
        try {
            /**
             * 1. 채널 세부 정보 조회 -> DB에서 발생한 에러는 catch문으로 처리
             * @params
             * - 채널아이디
             * - 공개 여부 
             * @return
             * - 채널 세부 정보 -> type: object
             * */
            const channelDetail = await Channel.findOne({
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

            console.log('channelDetail: ', channelDetail);

            // 에러: 채널 세부 정보가 존재하지 않을때 -> DB 데이터 존재 x
            if (!channelDetail) {
                const status = errorType.D04.d404;
                const error = new Error(status);
                return error;
            }

            const status = successType.S02.s200;

            return {
                status: status,
                channelDetail: channelDetail
            }
        } catch (error) {
            throw error;
        }
    },
    // 1-2. 오픈 채널 찜 클릭 -> 관심채널에 추가
    patchAddOpenChannelToWishChannel: async (channelId, userId) => {
        try {
            // 1. 해당 채널이 존재하면서 공개 채널인 채널 조회 -> 데이터가 존재하는지 확인
            const openChannel = Channel.findOne({ _id: channelId, open: 'Y' })
                .select({
                    _id: 1,
                    open: 1
                })

            // 에러: 오픈채널컬럼이 존재하지 않을때 에러 처리
            if (!openChannel) {
                const errReport = errorType.D04.d404;
                const error = new Error(errReport);
                throw error;
            }

            /**
             * 2. 유저의 위시채널 목록 조회
             * @params
             * - 요청한 유저 아이디 
             * @return
             * - 매칭된 유저의 관심채널 배열
             * */
            const matchedUser = User.findById(userId)
                .select({
                    wishChannels: 1
                });

            // 에러: 매칭된 유저가 존재하지 않을때 에러 처리
            if (!matchedUser) {
                const errReport = errorType.D.D04
                const error = new Error(errReport);
                throw error;
            }

            // 3. 관심 채널 배열에 푸쉬
            matchedUser.wishChannels.push(channelId);

            // 4. 수정된 데이터 저장 -> DB에서 발생한 에러는 catch문으로 처리
            const savedUser = await matchedUser.save();

            // 에러: 저장된 유저가 없을때 에러 처리
            if (!savedUser) {
                const errReport = errorType.D.D04
                const error = new Error(errReport);
                throw error;
            }

            console.log('matchedUser :', matchedUser);
            const status = successType.S02.s200;

            return {
                status: status
            };
        } catch (err) {
            throw err;
        }
    },
    // 해당 아이디의 채널목록 조회
    getChannelListByUserId: async userId => {
        try {
            const user = await User.findById(userId).populate('channels');//populate함수로 해당아이디에대한 채널정보 모두 가져오기

            if (!user) {
                const errReport = errorType.D.D04
                const error = new Error(errReport);
                throw error;
            }
            const status = successType.S02.s200;
            return {
                status: status,
                channels: user.channels
            };
        } catch (err) {
            throw err;
        }
    },
    // 채널 생성
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
            throw err;
        }
    }
}

export default channelService;