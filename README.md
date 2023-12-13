# soulmate-nodejs-backend
앱 이름: Soulmate, 언제든지 소통할 수 있는 메신저 애플리케이션

# 사용한 기술 스택
<div align="left">

#### BackEnd
![Nodejs](https://img.shields.io/badge/-Nodejs-339933?style=for-the-badge&logo=Node.js&logoColor=white)<br>
![Expressjs](https://img.shields.io/badge/expressjs-000000?style=for-the-badge&logo=express&logoColor=white)
![Mongoose](https://img.shields.io/badge/mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

#### DB
![MongoDB](https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white)<br>
![Redis](https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

#### DevOps
![swagger](https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white)
![Github](https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white)
![Postman](https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)<br>
![Amazons3](https://img.shields.io/badge/amazons3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![Amazonec2](https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
#### FrontEnd
![JavaScript](https://img.shields.io/badge/-JavaScript-%23F7DF1C?style=for-the-badge&logo=javascript&logoColor=000000&labelColor=%23F7DF1C&color=%23FFCE5A)<br>
![HTML5](https://img.shields.io/badge/-HTML5-F05032?style=for-the-badge&logo=html5&logoColor=ffffff)
![CSS3](https://img.shields.io/badge/-CSS3-007ACC?style=for-the-badge&logo=css3)
<!-- ![Docker](https://img.shields.io/badge/-Docker-46a2f1?style=for-the-badge&logo=Docker&logoColor=white) -->
#### OS
![MacOs](https://img.shields.io/badge/macos-000000?style=for-the-badge&logo=macos&logoColor=white)
</div>

# 개발 히스토리
- RESTful 아키텍처 채택, Nodejs, MongoDB, Swagger를 사용하여 백엔드 API 개발 및 관리<br>
- SSR방식으로 Nodejs의 View Templete Engine인 ejs 사용하여 클라이언트 화면 구축<br>
- 각 웹페이지마다 필요한 데이터만 조회하기 위해 mongoose 쿼리연산자를 적극 이용하여 필수 데이터는 조회하고 프론트와 백엔드간에 효율적인 데이터관리로 인한 응답 시간 단축<br>
- 유저가 속한 채널 데이터를 Client 사이드 메뉴에 유지시키기위해 세션으로 관리하고 세션저장소를 메모리기반 DB인 Redis를 사용하여 데이터 유지하도록 서비스<br>
- 실시간 채팅 기능과 실시간 워크스페이스 게시물 업로딩을 위해 npm: socket.io의 on emit 함수를 사용하여 백엔드 서버에서 프론트로 실시간 응답, 데이터를 받아 화면에 채팅 태그 생성<br>
- 효율적인 백엔드 api 관리와 웹브라우저에서 데이터 모니터링을 위해 npm: swagger-ui-express, swagger-jsdoc 세팅후 swagger 사용 하여 관리<br>
- 서버 shut down시 휘발되는 세션을 비휘발성으로 바꾸기위해 세션 저장소를 Redis로 세팅<br>
- 애플리케이션 배포와 파일 관리위한 AWS EC2 S3 인프라 구축<br>
- 전반적인 애플리케이션 DB 구조 이해와 관리가 필요하여 ERD 설계<br>
- 인증이 필요한 기능들은 JWT 검증과정을 미들웨어 함수로 추가<br>
- 예외상황 발생시 어떤 에러인지 파악하고 처리하기위해 상속기반 에러핸들러 로직 추가<br>


# soulmate 아키텍처
- 서비스 아키텍처
<img src="./readme-images/SOULMATE 아키텍처.png">
- BACKEND API 서버 Route Middleware 아키텍처 
<img src="./readme-images/API 서버 미들웨어 아키텍처.png">



