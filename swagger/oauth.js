/**
 * @swagger
 * tags:
 *      name: oauth-route
 *      description: oauth API
 * definitions:
 *      oauth200:
 *          type: object
 *          properties:
 *              code:
 *                  type: integer
 *                  example: 200
 *              status:
 *                  type: string
 *                  example: 'OK'
 *              msg:
 *                  type: string
 *                  example: '카카오로부터 응답을 받았습니다.'
 *      200:
 *          type: object
 *          properties:
 *              code:
 *                  type: integer
 *                  example: 200
 *              status:
 *                  type: string
 *                  example: 'OK'
 *              msg:
 *                  type: string
 *                  example: '응답 성공했습니다.'
 *      302:
 *          type: object
 *          required:
 *              - code
 *              - status
 *              - msg
 *          properties:
 *              code:
 *                  type: int
 *                  example: 302
 *              status:
 *                  type: string
 *                  example: 'Found'
 *              msg:
 *                  type: string
 *                  example: '일시적 이동 상태 입니다.'
 *      authStatus:
 *          type: object
 *          required:
 *              - hasNewAccessToken
 *              - newAccessToken
 *          properties:
 *              hasNewAccessToken:
 *                  type: boolean
 *                  description: 토큰 만료시 새로운 토큰 발급(true)
 *                  example: false
 *              newAccessToken:
 *                  type: string
 *                  description: 새로운 토큰
 *                  example: null
 * paths:
 *  /api/v1/oauth/kakao/authorize:
 *      get:
 *          summary: '카카오 로그인 페이지 URL 요청'
 *          description: '카카오 로그인 페이지 URL 요청'
 *          tags: [oauth-route]
 *          responses:
 *              '302':
 *                  description: 카카오 인증 페이지 URL 리턴 
 *                  content: 
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 status:
 *                                  $ref: '#/definitions/302'
 *                                 url:
 *                                  type: string
 *                                  example: 'https://accounts.kakao.com/login?continue=......'
 */

/**
 * @swagger
 * paths:
 *  /api/v1/oauth/kakao/token:
 *      get:
 *          summary: '카카오 API에 해당유저에대한 토큰 요청'
 *          description: '카카오 API에 해당유저에대한 토큰 요청'
 *          tags: [oauth-route]
 *          parameters:
 *              - in: query
 *                name: code
 *                description: 카카오 코드
 *                schema:
 *                  type: string
 *                  example: iveXu_kkF3MiG6z59ICZeAWGsdY22fgxUAV0sC7sz2ul6tSl6B7jp7z8xg4KKwzTAAABjBjBvWLMISgqRbFCUQ
 *          responses:
 *              '200':
 *                  description: 응답 성공
 *                  content: 
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 status:
 *                                  $ref: '#/definitions/oauth200'
 *                                 body:
 *                                  type: object
 *                                  properties:
 *                                      access_token:
 *                                          type: string
 *                                          example: LtrApy5ulrpzGkCkvzXQv0o3nwMGssnBeWQKPXOaAAABjBjBvn_6Fwx8Dt1GgQ
 *                                      token_type:
 *                                          type: string
 *                                          example: bearer
 *                                      refresh_token:
 *                                          type: string
 *                                          example: qG703NuKGMd7vv2MYmw36iEXRwDLveBfox8KPXOaAAABjBjBvnz6Fwx8Dt1GgQ
 *                                      expires_in:
 *                                          type: integer
 *                                          example: 21599
 *                                      scope:
 *                                          type: string
 *                                          example: account_email profile_image gender profile_nickname
 *                                      refresh_token_expires_in:
 *                                          type: integer
 *                                          example: 5183999
 */

/**
 * @swagger
 * paths:
 *  /api/v1/oauth/signin:
 *      post:
 *          summary: '카카오 API에 유저 정보 조회 -> 카카오계정으로 앱에 가입되어있나? yes -> 로그인 : No 유저 추가 -> 로그인'
 *          description: '카카오 API에 유저 정보 조회 -> 카카오계정으로 앱에 가입되어있나? yes -> 로그인 : No 유저 추가 -> 로그인'
 *          tags: [oauth-route]
 *          requestBody:
 *              content:
 *                  application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                      access_token:
 *                                          type: string
 *                                          example: LtrApy5ulrpzGkCkvzXQv0o3nwMGssnBeWQKPXOaAAABjBjBvn_6Fwx8Dt1GgQ
 *                                      token_type:
 *                                          type: string
 *                                          example: bearer
 *                                      refresh_token:
 *                                          type: string
 *                                          example: qG703NuKGMd7vv2MYmw36iEXRwDLveBfox8KPXOaAAABjBjBvnz6Fwx8Dt1GgQ
 *                                      expires_in:
 *                                          type: integer
 *                                          example: 21599
 *                                      scope:
 *                                          type: string
 *                                          example: account_email profile_image gender profile_nickname
 *                                      refresh_token_expires_in:
 *                                          type: integer
 *                                          example: 5183999
 *                                      company:
 *                                          type: string
 *                                          example: kakao 
 *          responses:
 *              '200':
 *                  description: 응답 성공
 *                  content: 
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 status:
 *                                  $ref: '#/definitions/200'
 *                                  example: 응답 성공
 *                                 token:
 *                                  type: string
 *                                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGUyMTJmZDQ5Y2VlNTkwNWQ5ZjRlZmYiLCJpYXQiOjE3MDEyMjI0MDAsImV4cCI6MTcwMTIyNjAwMH0.yk51RYFwGzsVEZui2CbTS4TwDykWYkuRKK-I_2c3Z6E'
 *                                 refreshToken:
 *                                  type: string
 *                                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEyMjI0MDAsImV4cCI6MTcwMjQzMjAwMH0.eLMmoas53OylLMamCGlsDcknHje9MuDaazDyoHcHKpY'
 *                                 name:
 *                                  type: string
 *                                  example: '홍길동'
 *                                 photo:
 *                                  type: string
 *                                  example: 'http://localhost:8080/images/user_profiles/soulmate_Photo_lnmjzpvc.jpeg'
 */