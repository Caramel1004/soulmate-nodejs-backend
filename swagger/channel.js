/**
 * @swagger
 * tags:
 *      name: channel-route
 *      description: 채널 API
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
 * paths:
 *   /api/v1/channel/openchannel-list:
 *       post:
 *          summary: '검색키워드와 카테고리에따른 오픈 채널 검색 및 조회'
 *          description: '검색키워드에의한 오픈 채널 검색 및 조회'
 *          tags: [channel-route]
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              searchWord:
 *                                  type: string
 *                                  description: 검색 키워드
 *                                  example: nodejs
 *                              category:
 *                                  type: string
 *                                  description: 카테고리
 *                                  example: 개발
 *          responses:
 *             '200':
 *               description: 응답 성공
 *               content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                 $ref: '#/definitions/success'
 *                              channels:
 *                                  type: array
 *                                  items:
 *                                     type: object
 *                                     properties:
 *                                      _id:
 *                                          type: objectId
 *                                          description: 채널아이디(doc_id)
 *                                          example: 654b5200299e8332eed9de5b
 *                                      channelName:
 *                                          type: string
 *                                          description: 채널명
 *                                          example: Nodejs 개발자채널
 *                                      thumbnail:
 *                                          type: string
 *                                          description: 채널 썸네일
 *                                          example: http://localhost:8080/images/channel_thumbnail/soulmate_Photo_lopjq4wx.jpeg
 *                                      category:
 *                                          type: array
 *                                          items:
 *                                             type: string
 *                                             example: 개발
 *                                      members:
 *                                          type: array
 *                                          items:
 *                                             type: objectId
 *                                             description: 유저아이디(doc_id)
 *                                             example: 64977f03cd466d4f263e920e                                        
 */

/**
 * @swagger
 * paths: 
 *  /api/v1/channel/openchannel-list/{channelId}:
 *      get:
 *         summary: 오픈 채널 세부정보 조회
 *         description: 오픈 채널 세부정보 조회
 *         tags: [channel-route]
 *         parameters:
 *           - in: path
 *             name: channelId
 *             required: true
 *             description: 채널아이디
 *             schema:
 *               type: string
 *               example: 654b5200299e8332eed9de5b
 *         responses:
 *             '200':
 *               description: 응답 성공
 *               content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                 $ref: '#/definitions/success'
 *                              channelDetail:
 *                                  type: object
 *                                  properties:
 *                                      _id:
 *                                          type: objectId
 *                                          description: _doc id
 *                                          example: 654b5200299e8332eed9de5b
 *                                      channelName:
 *                                          type: string
 *                                          description: 채널명
 *                                          example: Nodejs 개발자채널
 *                                      owner:
 *                                          type: object
 *                                          properties:
 *                                              _id:
 *                                                  type: objectId
 *                                                  description: 유저아이디(doc_id)
 *                                                  example: 64977f03cd466d4f263e920e
 *                                              name:
 *                                                  type: string
 *                                                  description: 닉네임
 *                                                  example: 카라멜프라푸치노
 *                                              photo:
 *                                                  type: string
 *                                                  description: 프로필사진
 *                                                  example: "http://localhost:8080/images/user_profiles/soulmate_Photo_lnjvk0yj.gif"
 *                                      thumbnail:
 *                                          type: string
 *                                          description: 채널 썸네일
 *                                          example: http://localhost:8080/images/channel_thumbnail/soulmate_Photo_lopjq4wx.jpeg
 *                                      category:
 *                                          type: array
 *                                          items:
 *                                             type: string
 *                                             description: 카테고리
 *                                             example: 개발
 *                                      comment:
 *                                          type: string
 *                                          description: 코멘트
 *                                          example: '- Nodejs 코드 리뷰 -\n*코드 피드백'
 *                                      members:
 *                                          type: array
 *                                          items:
 *                                             type: objectId
 *                                             description: 유저아이디(doc_id)
 *                                             example: 64977f03cd466d4f263e920e
 *                                      workSpaces:
 *                                          type: array
 *                                          items:
 *                                             type: objectId
 *                                             description: 워크스페이스 아이디(doc_id)
 *                                             example: 656597a80b20acaef2749e0c
 *                                      chatRooms:
 *                                          type: array
 *                                          items:
 *                                             type: objectId
 *                                             description: 채팅룸 아이디(doc_id)
 *                                             example: 656597b50b20acaef2749e25
 *                                      feeds:
 *                                          type: array
 *                                          items:
 *                                             type: object
 *                                             description: 피드리스트
 *                                             example: {"_id": "656590081c242456d0728c45",
 *                                                       "channelId": "654b5200299e8332eed9de5b",
 *                                                       "title": "개발자 채널 개설",
 *                                                       "imageUrls": [
 *                                                         "https://soulmates.s3.ap-northeast-2.amazonaws.com/files/soulmate_Photo_lphznr83.image/jpeg"
 *                                                       ],
 *                                                       "content": "- 코드 피드백\r\n- 기술 스택 공유\r\n- 포트폴리오 피드백",
 *                                                       "creator": {
 *                                                         "_id": "64977f03cd466d4f263e920e",
 *                                                         "name": "카라멜프라푸치노",
 *                                                         "photo": "http://localhost:8080/images/user_profiles/soulmate_Photo_lnjvk0yj.gif"
 *                                                       },
 *                                                       "likes": [],                                                                                               
 *                                                       "feedReplys": [],
 *                                                        "createdAt": "2023-11-28T07:00:24.555Z",
 *                                                        "updatedAt": "2023-11-28T07:00:24.555Z"                                                                                               
 *                                                      }
 */