import multer from 'multer';
import fs from 'fs';
import dotenv from 'dotenv';
import { S3, S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import multerS3 from 'multer-s3';

dotenv.config();

/** 파일 저장소 s3로 변경, s3 인스턴스 생성 */
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    },
    region: process.env.S3_BUCKET_REGION
})

// 버퍼형태로 오기떄문에 multer가 감지를 못함
// const fileStorage = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.BUCKET,
//         metadata: function (req, file, cb) {
//             console.log('multerS3')
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: (req, file, callback) => {
//             console.log('multerS3')
//             callback(null, `files/${new Date().getTime().toString(36)}`);
//         }
//     }),
//     limits: { fieldSize: 25 * 1024 * 1024 }
// });


// s3
const filesS3Handler = {
    test: async (req, res, next) => {
        console.log('s3 테스트 중');

        // JSON형태로 되어있는 file 객체를 파싱하는 과정 -> buffer 프로퍼티의 data프로퍼티(배열 형태)값을 버퍼로 변환
        const { files } = req.body;
        const parsedFiles = JSON.parse(files, (key, value) => {
            const parsedJson = value && value.type === 'Buffer' ? Buffer.from(value) : value;
            return parsedJson;
        });
        console.log('parsedFiles[0]: ', parsedFiles[0]);

        const uploadParams = {
            Bucket: process.env.BUCKET,
            Key: `files/soulmate_Photo_${new Date().getTime().toString(36)}.${parsedFiles[0].mimetype}`,
            Body: parsedFiles[0].buffer,
            ContentType: parsedFiles[0].mimetype,
        };
        console.log('uploadParams: ', uploadParams);

        const response = await s3.send(new PutObjectCommand(uploadParams));
        console.log('response: ', response);
        next();
    },
    // 1. 워크스페이스, 채팅방에 올린 파일 핸들러
    uploadFilesToS3: async (req, res, next) => {
        try {
            const { files } = req.body;
            req.body.fileUrls = [];
         
            if (req.body.existFileUrls) {
                const parsedExistFileUrls = JSON.parse(req.body.existFileUrls)
                for (const fileUrl of parsedExistFileUrls.existFileUrls) {
                    req.body.fileUrls.push(fileUrl);
                }
            }

            // JSON형태로 되어있는 file 객체를 파싱하는 과정 -> buffer 프로퍼티의 data프로퍼티(배열 형태)값을 버퍼로 변환
            const parsedFiles = JSON.parse(files, (key, value) => {
                const parsedJson = value && value.type === 'Buffer' ? Buffer.from(value) : value;
                return parsedJson;
            });

            if (parsedFiles.length > 0) {
                for (const parsedFile of parsedFiles) {
                    const fileId = new Date().getTime().toString(36);
                    const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/files/soulmate_Photo_${fileId}.${parsedFile.mimetype}`;
                    // s3에 업로드
                    const putObjectCommandOpts = {
                        Bucket: process.env.S3_BUCKET,
                        Key: `files/soulmate_Photo_${fileId}.${parsedFile.mimetype}`,
                        Body: parsedFile.buffer,
                        ContentType: parsedFile.mimetype,
                    };

                    const s3Response = await s3.send(new PutObjectCommand(putObjectCommandOpts));

                    if (s3Response.$metadata.httpStatusCode != 200) {
                            new Error('파일 업로드 실패, 서버에 문제가 생겼습니다.')
                        }
                    req.body.fileUrls.push(fileUrl);
                }
                // console.log(req.body.fileUrls)
            }
            console.log(req.body.fileUrls)
            next();
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    // 2. 유저 프로필 사진 파일 핸들러
    uploadUserPhotoToS3: async (req, res, next) => {
        try {
            const { photo } = req.body;
            req.body.fileUrls = [];

            // JSON형태로 되어있는 file 객체를 파싱하는 과정 -> buffer 프로퍼티의 data프로퍼티(배열 형태)값을 버퍼로 변환
            const parsedPhoto = JSON.parse(photo, (key, value) => {
                const parsedJson = value && value.type === 'Buffer' ? Buffer.from(value) : value;
                return parsedJson;
            });

            if (parsedPhoto.length > 0) {
                // s3에 업로드
                const fileId = new Date().getTime().toString(36);
                const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/images/users_photo/soulmate_Photo_${fileId}.${parsedPhoto[0].mimetype}`;

                const putObjectCommandOpts = {
                    Bucket: process.env.S3_BUCKET,
                    Key: `images/users_photo/soulmate_Photo_${fileId}.${parsedPhoto[0].mimetype}`,
                    Body: parsedPhoto[0].buffer,
                    ContentType: parsedPhoto[0].mimetype,
                };

                const s3Response = await s3.send(new PutObjectCommand(putObjectCommandOpts));

                req.body.fileUrls.push(fileUrl);
                console.log(s3Response);
                if (s3Response.$metadata.httpStatusCode != 200) {
                    new Error('파일 업로드 실패, 서버에 문제가 생겼습니다.')
                }
            }
            next();
        } catch (error) {
            next(error);
        }
    },
    // 3. 채널 썸네일 이미지 파일 핸들러
    uploadChannelThumbnailToS3: async (req, res, next) => {
        try {
            console.log(req.body);
            const { thumbnail } = req.body;
            req.body.fileUrls = [];
            if (thumbnail != 'undefined' && thumbnail != 'null') {
                console.log('진입');
                // JSON형태로 되어있는 file 객체를 파싱하는 과정 -> buffer 프로퍼티의 data프로퍼티(배열 형태)값을 버퍼로 변환
                const parsedThumbnail = JSON.parse(thumbnail, (key, value) => {
                    const parsedJson = value && value.type === 'Buffer' ? Buffer.from(value) : value;
                    return parsedJson;
                });

                // s3에 업로드
                const fileId = new Date().getTime().toString(36);
                const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/images/channels_thumbnail/soulmate_Photo_${fileId}.${parsedThumbnail[0].mimetype}`;

                const putObjectCommandOpts = {
                    Bucket: process.env.S3_BUCKET,
                    Key: `images/channels_thumbnail/soulmate_Photo_${fileId}.${parsedThumbnail[0].mimetype}`,
                    Body: parsedThumbnail[0].buffer,
                    ContentType: parsedThumbnail[0].mimetype,
                };

                const s3Response = await s3.send(new PutObjectCommand(putObjectCommandOpts));

                req.body.fileUrls.push(fileUrl);
            }
            next();
        } catch (error) {
            next(error);
        }
    },
    deletePhotoList: async fileUrls => {
        try {
            for (const fileUrl of fileUrls) {
                const fileStorage = fileUrl.split('com/')[1];
                const deleteObjectCommand = {
                    Bucket: process.env.S3_BUCKET,
                    Key: fileStorage,
                }
                await s3.send(new DeleteObjectCommand(deleteObjectCommand));
            }
        } catch (err) {
            next(err);
        }
    }
}

export default filesS3Handler