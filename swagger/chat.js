/**
 * @swagger
 * tags:
 *      name: chat-route
 *      description: 채팅방 API
 * definitions:
 *      success:
 *          type: object
 *          required:
 *              - code
 *              - status
 *              - msg
 *          properties:
 *              code:
 *                  type: int
 *                  example: 200
 *              status:
 *                  type: string
 *                  example: 'OK'
 *              msg:
 *                  type: string
 *                  example: '응답 성공했습니다.'
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
 *  /api/v1/chat/{channelId}/{chatRoomId}:
 *      get:
 *          summary: '채팅방 세부정보 조회'
 *          description: '채팅방 세부정보 조회'
 *          tags: [chat-route]
 *          parameters:
 *           - in: header
 *             name: Authorization
 *             required: true
 *             description: jwt
 *             schema:
 *               type: string
 *               example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDk3N2YwM2NkNDY2ZDRmMjYzZTkyMGUiLCJpYXQiOjE3MDExNTY3NTksImV4cCI6MTcwMTE2MDM1OX0.cGiRARiGti96tgz254CFBeZ-2aA0sdVGZaShW-7-8Kw
 *           - in: path
 *             name: channelId
 *             required: true
 *             description: 채널아이디
 *             schema:
 *               type: string
 *               example: 654b5200299e8332eed9de5b
 *           - in: path
 *             name: chatRoomId
 *             required: true
 *             description: 채팅방아이디
 *             schema:
 *               type: string
 *               example: 656597b50b20acaef2749e25
 *          responses:
 *              '200':
 *                  description: 응답 성공
 *                  content: 
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 status:
 *                                  $ref: '#/definitions/success'
 *                                 authStatus:
 *                                  $ref: '#/definitions/authStatus'     
 */

/**
 * @swagger
 * paths:
 *   /api/v1/chat/channel-members/{channelId}/{chatRoomId}:
 *      get:
 *          summary: '채팅방에서 채널 멤버들 조회'
 *          description: '채팅방에서 채널 멤버들 조회'
 *          tags: [chat-route]
 *          parameters:
 *           - in: path
 *             name: channelId
 *             required: true
 *             description: 채널아이디
 *             schema:
 *               type: string
 *               example: 654b5200299e8332eed9de5b
 *           - in: path
 *             name: chatRoomId
 *             required: true
 *             description: 채팅방아이디
 *             schema:
 *               type: string
 *               example: 656597b50b20acaef2749e25
 *          responses:
 *              '200':
 *                  description: 응답 성공
 *                  content: 
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 status:
 *                                  $ref: '#/definitions/success'
 *                                 authStatus:
 *                                  $ref: '#/definitions/authStatus'
 */

/**
 * @swagger
 * paths:
 *   /api/v1/chat/file-list/{channelId}/{chatRoomId}:
 *      get:
 *          summary: '채팅방 파일함 리스트 조회'
 *          description: '채팅방 파일함 리스트 조회'
 *          tags: [chat-route]
 *          parameters:
 *           - in: path
 *             name: channelId
 *             required: true
 *             description: 채널아이디
 *             schema:
 *               type: string
 *               example: 654b5200299e8332eed9de5b
 *           - in: path
 *             name: chatRoomId
 *             required: true
 *             description: 채팅방아이디
 *             schema:
 *               type: string
 *               example: 656597b50b20acaef2749e25
 *          responses:
 *              '200':
 *                  description: 응답 성공
 *                  content: 
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 status:
 *                                  $ref: '#/definitions/success'
 *                                 authStatus:
 *                                  $ref: '#/definitions/authStatus'
 */

/**
 * @swagger
 * paths:
 *   /api/v1/chat/send-content/{channelId}/{chatRoomId}:
 *      post:
 *          summary: '실시간 채팅과 파일 업로드 및 채팅창 실시간 업데이트 요청'
 *          description: '실시간 채팅과 파일 업로드 및 채팅창 실시간 업데이트 요청'
 *          tags: [chat-route]
 *          parameters:
 *           - in: header
 *             name: Authorization
 *             required: true
 *             description: jwt
 *             schema:
 *               type: string
 *               example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDk3N2YwM2NkNDY2ZDRmMjYzZTkyMGUiLCJpYXQiOjE3MDExNTY3NTksImV4cCI6MTcwMTE2MDM1OX0.cGiRARiGti96tgz254CFBeZ-2aA0sdVGZaShW-7-8Kw
 *           - in: path
 *             name: channelId
 *             required: true
 *             description: 채널아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 654b5200299e8332eed9de5b
 *           - in: path
 *             name: chatRoomId
 *             required: true
 *             description: 채팅방아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 656597b50b20acaef2749e25
 *          requestBody:
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              chat:
 *                                  type: string
 *                                  description: 채팅내용(텍스트)
 *                              files:
 *                                  type: JSON
 *                                  description: 버퍼로 인코딩된 파일 
 *          responses:
 *              '200':
 *                  description: 응답 성공
 *                  content: 
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 status:
 *                                  $ref: '#/definitions/success'
 *                                 authStatus:
 *                                  $ref: '#/definitions/authStatus'
 */

/**
 * @swagger
 * paths:
 *   /api/v1/chat/invite/{channelId}/{chatRoomId}:
 *      patch:
 *          summary: '채팅방에 채널 멤버 초대'
 *          description: '채팅방에 채널 멤버 초대'
 *          tags: [chat-route]
 *          parameters:
 *           - in: path
 *             name: channelId
 *             required: true
 *             description: 채널아이디
 *             schema:
 *               type: string
 *               example: 654b5200299e8332eed9de5b
 *           - in: path
 *             name: chatRoomId
 *             required: true
 *             description: 채팅방아이디
 *             schema:
 *               type: string
 *               example: 656597b50b20acaef2749e25
 *          responses:
 *              '200':
 *                  description: 응답 성공
 *                  content: 
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 status:
 *                                  $ref: '#/definitions/success'
 *                                 authStatus:
 *                                  $ref: '#/definitions/authStatus'
 */

/**
 * @swagger
 * paths:
 *   /api/v1/exit/{channelId}/{chatRoomId}:
 *      patch:
 *          summary: '채팅방 퇴장'
 *          description: '채팅방 퇴장'
 *          tags: [chat-route]
 *          parameters:
 *           - in: path
 *             name: channelId
 *             required: true
 *             description: 채널아이디
 *             schema:
 *               type: string
 *               example: 654b5200299e8332eed9de5b
 *           - in: path
 *             name: chatRoomId
 *             required: true
 *             description: 채팅방아이디
 *             schema:
 *               type: string
 *               example: 656597b50b20acaef2749e25
 *          responses:
 *              '200':
 *                  description: 응답 성공
 *                  content: 
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 status:
 *                                  $ref: '#/definitions/success'
 *                                 authStatus:
 *                                  $ref: '#/definitions/authStatus'
 */

