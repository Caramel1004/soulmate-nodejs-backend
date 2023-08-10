import fetch from 'node-fetch';

const kakaoAPI = {
    // 1. 카카오 동의페이지
    getKakaoLoginPageURL: async next => {
        try {
            const response = await fetch(`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile_nickname,profile_image,account_email,gender`,{
                method: 'GET',
            });

            return response;
        } catch (err) {
            next(err);
        }
    },
    // 4. 카카오 토큰 받기
    postSignUpByKakaoAccount: async next => {
        try {
            const response = await fetch(`https://kauth.kakao.com/oauth/token`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: JSON.stringify({
                    grant_type: '1IKam3MmVT7_N6Ey05KnK5YhXH50gGXtXznLjCRwSkUi10Pb_MKYem0k-YbqDIY-kt7S_QopyV4AAAGJ2tNq5w',
                    client_id: process.env.KAKAO_REST_API_KEY,
                    redirect_uri: 'http://localhost:3000',
                    code: '1IKam3MmVT7_N6Ey05KnK5YhXH50gGXtXznLjCRwSkUi10Pb_MKYem0k-YbqDIY-kt7S_QopyV4AAAGJ2tNq5w'
                })
            });
            console.log(response);
            const data = await response.json();
            
            return data;
        } catch (err) {
            next(err);
        }
    }
}

export default kakaoAPI