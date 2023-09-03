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

// const redisCli = redisClient.v4 // 기본 redisClient 객체는 콜백기반인데 v4버젼은 프로미스 기반이라 사용

// // GET
// router.get('/', (req, res, next) => {
//    await redisCli.get('username');
// });

// // POST
// router.post('/set', (req, res, next) => {
//    await redisCli.set('username', 'inpa');
// });

// // DELETE
// router.delete('/del', (req, res, next) => {
//    // exist : 키가 존재하는지
//    const n = await redisCli.exists('username'); // true: 1 , false: 0
//    if(n) await redisCli.del('username');
// });

// // PUT
// router.put('/rename', (req, res, next) => {
//    // username이라는 키값이 있다면 그 값을 helloname으로 바꿈
//    redisCli.rename('username', 'helloname');
// });
export default redisClient