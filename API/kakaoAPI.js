import fetch from 'node-fetch';

const kakaoAPI = {
    // 1. 카카오 동의페이지
    getKakaoAccountPage: async next => {
        try {
            const response = await fetch(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = response;
            console.log(data);
            return data;
        } catch (err) {
            next(err);
        }
    },
}

export default kakaoAPI