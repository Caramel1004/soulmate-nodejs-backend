import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// 클라우드로 사용
const redisClient = createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    legacyMode: true
})


export default redisClient