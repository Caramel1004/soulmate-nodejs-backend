/**
 * @swagger
 * tags:
 *      name: workspace-route
 *      description: 워크스페이스 API
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
 *  /api/v1/workspace/{channelId}/{workspaceId}:
 *      get:
 *          summary: '워크스페이스 세부정보 조회'
 *          description: '워크스페이스 세부정보 조회'
 *          tags: [workspace-route]
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
 *             name: workSpaceId
 *             required: true
 *             description: 워크스페이스아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 656597a80b20acaef2749e0c
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
 *   /api/v1/workspace/create-post/{channelId}/{workSpaceId}:
 *      post:
 *          summary: 게시물 생성
 *          description: 게시물 생성
 *          tags: [workspace-route]
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
 *             name: workSpaceId
 *             required: true
 *             description: 워크스페이스아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 656597a80b20acaef2749e0c
 *          requestBody:
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          required:
 *                              - content
 *                          type: object
 *                          properties:
 *                              content:
 *                                  type: string
 *                                  description: 게시물 내용
 *                              files:
 *                                  type: array
 *                                  description: 업로드 파일 리스트
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
 *   /api/v1/workspace/edit-post/{channelId}/{workSpaceId}:
 *      put:
 *          summary: 워크스페이스에서 해당 유저의 게시물 내용 수정
 *          description: 워크스페이스에서 해당 유저의 게시물 내용 수정
 *          tags: [workspace-route]
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
 *             name: workSpaceId
 *             required: true
 *             description: 워크스페이스아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 656597a80b20acaef2749e0c
 *          requestBody:
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          required:
 *                              - content
 *                          type: object
 *                          properties:
 *                              content:
 *                                  type: string
 *                                  description: 게시물 내용
 *                              files:
 *                                  type: array
 *                                  description: 업로드 파일 리스트
 *                              postId:
 *                                  type: string
 *                                  description: 게시물아이디(doc_id)
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
 *   /api/v1/workspace/delete-post/{channelId}/{workSpaceId}/{postId}:
 *      delete:
 *          summary: 워크스페이스에서 해당 유저의 게시물 삭제
 *          description: 워크스페이스에서 해당 유저의 게시물 삭제
 *          tags: [workspace-route]
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
 *             name: workSpaceId
 *             required: true
 *             description: 워크스페이스아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 656597a80b20acaef2749e0c
 *           - in: path
 *             name: postId
 *             required: true
 *             description: 게시물아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 6568274d8b031b8c6905276d
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
 *                                 deletionResult:
 *                                  type: object
 *                                  properties:
 *                                     acknowledged:
 *                                      type: boolean
 *                                      description: 게시물 삭제 승인 여부
 *                                      example: true
 *                                     deletedCount:
 *                                      type: integer
 *                                      desciption: 삭제된 게시물 갯수
 *                                      example: 1
 */

/**
 * @swagger
 * paths:
 *  /api/v1/workspace/post/replies/{channelId}/{workSpaceId}/{postId}:
 *      get:
 *          summary: 댓글 조회
 *          description: 댓글 조회
 *          tags: [workspace-route]
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
 *             name: workSpaceId
 *             required: true
 *             description: 워크스페이스아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 656597a80b20acaef2749e0c
 *           - in: path
 *             name: postId
 *             required: true
 *             description: 게시물아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 6568274d8b031b8c6905276d
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
 *   /api/v1/workspace/post/create-reply/channelId}/{workSpaceId}:
 *      post:
 *          summary: 댓글 생성
 *          description: 댓글 생성
 *          tags: [workspace-route]
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
 *             name: workSpaceId
 *             required: true
 *             description: 워크스페이스아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 656597a80b20acaef2749e0c
 *          requestBody:
 *              description: 추후 댓글에 이미지파일 업로드 할수있도록 변경할 예정
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          required:
 *                              - content
 *                              - postId
 *                          type: object
 *                          properties:
 *                              content:
 *                                  type: string
 *                                  description: 댓글 내용
 *                              postId:
 *                                  type: string
 *                                  description: 게시물아이디(doc_id)
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
 *   /api/v1/workspace/edit-reply/{channelId}/{workSpaceId}:
 *      patch:
 *          summary: 댓글 수정
 *          description: 댓글 수정
 *          tags: [workspace-route]
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
 *             name: workSpaceId
 *             required: true
 *             description: 워크스페이스아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 656597a80b20acaef2749e0c
 *          requestBody:
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          required:
 *                              - content
 *                              - postId
 *                              - replyId
 *                          type: object
 *                          properties:
 *                              content:
 *                                  type: string
 *                                  description: 게시물 내용
 *                              postId:
 *                                  type: string
 *                                  description: 게시물아이디(doc_id)
 *                              replyId:
 *                                  type: string
 *                                  description: 댓글아이디(doc_id)
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
 *   /api/v1/workspace/delete-reply/{channelId}/{workSpaceId}/{postId}:
 *      delete:
 *          summary: 댓글 삭제
 *          description: 댓글 삭제
 *          tags: [workspace-route]
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
 *             name: workSpaceId
 *             required: true
 *             description: 워크스페이스아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 656597a80b20acaef2749e0c
 *           - in: path
 *             name: postId
 *             required: true
 *             description: 게시물아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 6568331ae59bb03c6a18de42
 *           - in: path
 *             name: postId
 *             required: true
 *             description: 댓글아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 65683cf02ca7b0eb973a5228
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
 *                                 deletionResult:
 *                                  type: object
 *                                  properties:
 *                                     acknowledged:
 *                                      type: boolean
 *                                      description: 댓글 삭제 승인 여부
 *                                      example: true
 *                                     deletedCount:
 *                                      type: integer
 *                                      desciption: 삭제된 댓글 갯수
 *                                      example: 1
 */

/**
 * @swagger
 * paths:
 *   /api/v1/workspace/invite/{channelId}/{workSpaceId}:
 *      patch:
 *          summary: 워크스페이스에 팀원 초대
 *          description: 워크스페이스에 팀원 초대
 *          tags: [workspace-route]
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
 *             name: workSpaceId
 *             required: true
 *             description: 워크스페이스아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 656597a80b20acaef2749e0c
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          required:
 *                              - selectedIds
 *                          type: object
 *                          properties:
 *                              selectedIds:
 *                                  type: array
 *                                  description: 선택한 유저아이디리스트(doc_id)
 *                                  example: ['64977f03cd466d4f263e920e', 64a3dacfbb335df2441b011e]
 *                                  items:
 *                                      type: string
 *                                      description: 사용자 아이디(doc_id)
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
 *   /api/v1/workspace/edit-comment/{channelId}/{workSpaceId}:
 *      patch:
 *          summary: 워크스페이스 설명 코멘트 편집
 *          description: 워크스페이스 설명 코멘트 편집
 *          tags: [workspace-route]
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
 *             name: workSpaceId
 *             required: true
 *             description: 워크스페이스아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 656597a80b20acaef2749e0c
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          required:
 *                              - comment
 *                          type: object
 *                          properties:
 *                              comment:
 *                                  type: string
 *                                  description: 선택한 유저아이디리스트(doc_id)
 *                                  example: 코멘트 수정
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
 *   /api/v1/workspace/exit:
 *      patch:
 *          summary: 워크스페이스 퇴장
 *          description: 워크스페이스 퇴장
 *          tags: [workspace-route]
 *          parameters:
 *           - in: header
 *             name: Authorization
 *             required: true
 *             description: jwt
 *             schema:
 *               type: string
 *               example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDk3N2YwM2NkNDY2ZDRmMjYzZTkyMGUiLCJpYXQiOjE3MDExNTY3NTksImV4cCI6MTcwMTE2MDM1OX0.cGiRARiGti96tgz254CFBeZ-2aA0sdVGZaShW-7-8Kw
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          required:
 *                              - channelId
 *                              - workSpaceId
 *                          type: object
 *                          properties:
 *                              channelId:
 *                                  type: string
 *                                  description: 채널아이디(doc_id)
 *                                  example: 654b5200299e8332eed9de5b
 *                              workSpaceId:
 *                                  type: string
 *                                  description: 워크스페이스아이디(doc_id)
 *                                  example: 656597a80b20acaef2749e0c
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
 */

/**
 * @swagger
 * paths:
 *  /api/v1/workspace/file-list/{channelId}/{workSpaceId}:
 *      get:
 *          summary: 워크스페이스 파일 리스트 조회
 *          description: 워크스페이스 파일 리스트 조회
 *          tags: [workspace-route]
 *          parameters:
 *           - in: header
 *             name: Authorization
 *             required: true
 *             description: accessToken
 *             schema:
 *               type: string
 *               example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDk3N2YwM2NkNDY2ZDRmMjYzZTkyMGUiLCJpYXQiOjE3MDEzOTkzMjEsImV4cCI6MTcwMTQwMjkyMX0.aHFHX-YAWFK-awVwfqwIcs40x139vlI4Vkt5uKB7sFQ
 *           - in: header
 *             name: RefreshToken
 *             required: true
 *             description: refreshToken
 *             schema:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzOTkzMjEsImV4cCI6MTcwMjYwODkyMX0.lfaQd8vCXr9cYCXwXJXuUD5Vn9ZEosZ2zIFelmFTvOY
 *           - in: path
 *             name: channelId
 *             required: true
 *             description: 채널아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 654b5200299e8332eed9de5b
 *           - in: path
 *             name: workSpaceId
 *             required: true
 *             description: 워크스페이스아이디(doc_id)
 *             schema:
 *               type: string
 *               example: 656597a80b20acaef2749e0c
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
 */