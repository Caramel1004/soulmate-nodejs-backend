import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// 클라우드로 사용
const redisClient = createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    legacyMode: true
})

redisClient.on('connect', () => console.log('Redis 연결!!'));

redisClient.on('error', () => {
    console.log('Redis 연결 실패!!')
    redisClient.emit('connect',() => console.log('Redis 재연결 시도!!'));
});

export default redisClient