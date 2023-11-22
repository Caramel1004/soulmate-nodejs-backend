import multer from 'multer';
import fs from 'fs';

// 파일 저장할 위치와 저장 형태 정의
const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'file');
    },
    filename: (req, file, callback) => {
        callback(null, new Date().getTime().toString(36));
    }
});

// 파일 확장자 검사
const fileFilter = (req, file, callback) => {
    const fileType = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    const mimeType = fileType.find(fileType => fileType === file.mimetype);
    if (mimeType) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

// 내보낼 파일핸들러 오브젝트
const filesHandler = {
    fileStorage: fileStorage,
    fileFilter: fileFilter,
    // 1. 워크스페이스, 채팅방에 올린 파일 핸들러
    saveUploadedFiles: async (req, res, next) => {
        try {
            const { files } = req.body;
            req.body.fileUrls = [];
            if (req.body.existFileUrls) {
                for (const fileUrl of req.body.existFileUrls) {
                    req.body.fileUrls.push(fileUrl.name);
                }
            }
            if (files.length > 0) {
                // JSON형태로 되어있는 file 객체를 파싱하는 과정 -> buffer 프로퍼티의 data프로퍼티(배열 형태)값을 버퍼로 변환
                const parsedFiles = JSON.parse(files, (key, value) => {
                    const parsedJson = value && value.type === 'Buffer' ? Buffer.from(value) : value;
                    return parsedJson;
                });

                console.log('parsedFiles: ', parsedFiles);
                // 두번째인수에 파일을 버퍼형태로 넣어줘야 파일 볼 수 있음
                for (const parsedFile of parsedFiles) {
                    const fileId = new Date().getTime().toString(36);
                    const mimeType = parsedFile.mimetype.split('/')[1];

                    fs.writeFileSync(`files/soulmate_Photo_${fileId}.${mimeType}`, parsedFile.buffer, () => {
                        console.log('파일 생성');
                    });

                    req.body.fileUrls.push(`files/soulmate_Photo_${fileId}.${mimeType}`);
                }
            }
            console.log(req.body.fileUrls);
            next();
        } catch (error) {
            next(error);
        }
    },
    // 2. 유저 프로필 사진 파일 핸들러
    saveUploadedUserPhoto: async (req, res, next) => {
        try {
            const { photo } = req.body;
            req.body.fileUrls = [];

            if (photo != 'undefined' && photo != 'null') {
                // JSON형태로 되어있는 file 객체를 파싱하는 과정 -> buffer 프로퍼티의 data프로퍼티(배열 형태)값을 버퍼로 변환
                const parsedPhoto = JSON.parse(photo, (key, value) => {
                    const parsedJson = value && value.type === 'Buffer' ? Buffer.from(value) : value;
                    return parsedJson;
                });

                // 두번째인수에 파일을 버퍼형태로 넣어줘야 파일 볼 수 있음
                const fileId = new Date().getTime().toString(36);
                const mimeType = parsedPhoto.mimetype.split('/')[1];
    
                fs.writeFileSync(`images/user_profiles/soulmate_Photo_${fileId}.${mimeType}`, parsedPhoto.buffer, () => {
                    console.log('파일 생성');
                });
                req.body.fileUrls.push(`http://localhost:8080/images/user_profiles/soulmate_Photo_${fileId}.${mimeType}`);
            }
            console.log(req.body.fileUrls);
            next();
        } catch (error) {
            next(error);
        }
    },
    // 3. 채널 썸네일 이미지 파일 핸들러
    saveUploadedChannelThumbnail: async (req, res, next) => {
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

                // 두번째인수에 파일을 버퍼형태로 넣어줘야 파일 볼 수 있음
                const fileId = new Date().getTime().toString(36);
                const mimeType = parsedThumbnail.mimetype.split('/')[1];

                fs.writeFileSync(`images/channel_thumbnail/soulmate_Photo_${fileId}.${mimeType}`, parsedThumbnail.buffer, () => {
                    console.log('파일 생성');
                });
                req.body.fileUrl = `http://localhost:8080/images/channel_thumbnail/soulmate_Photo_${fileId}.${mimeType}`;

                console.log(req.body.fileUrl);
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default filesHandler