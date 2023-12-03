/**
 * @swagger
 * tags:
 *      name: user-route
 *      description: 사용자 API
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
 *                  example: '응답 성공'
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
 *  /api/v1/user/signup:
 *      post:
 *          summary: 회원가입
 *          description: 회원가입
 *          tags: [user-route]
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          required:
 *                          - email
 *                          - name
 *                          - password
 *                          - gender
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  description: 이메일
 *                              name:
 *                                  type: string
 *                                  description: 닉네임
 *                              password:
 *                                  type: string
 *                                  description: 비밀번호
 *                              gender:
 *                                  type: string
 *                                  description: 성별
 *                              photo:
 *                                  type: array
 *                                  description: 프로필사진 URL
 *                              phone:
 *                                  type: string
 *                                  description: 핸드폰번호
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
 */

/**
 * @swagger
 * paths:
 *  /api/v1/user/login:
 *      post:
 *          summary: 로그인
 *          description: 로그인
 *          tags: [user-route]
 *          requestBody:
 *              description: test
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          required:
 *                          - email
 *                          - password
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  description: 이메일
 *                                  example: test@test.com
 *                              password:
 *                                  type: string
 *                                  description: 비밀번호
 *                                  example: 1234
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
 */

/**
 * @swagger
 * paths:
 *  /api/v1/user/search/{name}:
 *      post:
 *          summary: 검색 키워드로 유저 리스트 조회
 *          description: 검색 키워드로 유저 리스트 조회
 *          tags: [user-route]
 *          parameters:
 *           - in: path
 *             name: name
 *             required: true
 *             description: 사용자 닉네임
 *             schema:
 *               type: string
 *               example: 카라멜프라푸치노
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          required:
 *                          - channelId
 *                          type: object
 *                          properties:
 *                              channelId:
 *                                  type: string
 *                                  description: 채널아이디(doc_id)
 *                                  example: 654b5200299e8332eed9de5b
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
 */

/**
 * @swagger
 * paths:
 *  /api/v1/user/myprofile:
 *      get:
 *          summary: 내 프로필 조회
 *          description: 내 프로필 조회
 *          tags: [user-route]
 *          parameters:
 *           - in: header
 *             name: Authorization
 *             required: true
 *             description: jwt
 *             schema:
 *               type: string
 *               example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDk3N2YwM2NkNDY2ZDRmMjYzZTkyMGUiLCJpYXQiOjE3MDExNTY3NTksImV4cCI6MTcwMTE2MDM1OX0.cGiRARiGti96tgz254CFBeZ-2aA0sdVGZaShW-7-8Kw
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
 */

/**
 * @swagger
 * paths:
 *  /api/v1/user/edit-myprofile:
 *      patch:
 *          summary: 내 프로필 수정
 *          description: 내 프로필 수정
 *          tags: [user-route]
 *          parameters:
 *           - in: header
 *             name: Authorization
 *             required: true
 *             description: jwt
 *             schema:
 *               type: string
 *               example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDk3N2YwM2NkNDY2ZDRmMjYzZTkyMGUiLCJpYXQiOjE3MDExNTY3NTksImV4cCI6MTcwMTE2MDM1OX0.cGiRARiGti96tgz254CFBeZ-2aA0sdVGZaShW-7-8Kw
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          required:
 *                          - data
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: string
 *                                  description: 수정할 데이터
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
 */

/**
 * @swagger
 * paths:
 *  /api/v1/user/edit-myprofile-photo:
 *      patch:
 *          summary: 내 프로필 이미지 수정
 *          description: 내 프로필 이미지 수정
 *          tags: [user-route]
 *          parameters:
 *           - in: header
 *             name: Authorization
 *             required: true
 *             description: jwt
 *             schema:
 *               type: string
 *               example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDk3N2YwM2NkNDY2ZDRmMjYzZTkyMGUiLCJpYXQiOjE3MDExNTY3NTksImV4cCI6MTcwMTE2MDM1OX0.cGiRARiGti96tgz254CFBeZ-2aA0sdVGZaShW-7-8Kw
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          required:
 *                          - photo
 *                          type: object
 *                          properties:
 *                              photo:
 *                                  type: string
 *                                  description: 프로필사진
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
 */