import multer from 'multer';
import fs from 'fs';

// 파일 저장할 위치와 저장 형태 정의
// 해결: uuid패키지 사용
const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'file');
    },
    filename: (req, file, callback) => {
        callback(null, v4());
    }
});

// 파일 확장자 검사
const fileFilter = (req, file, callback) => {
    const fileType = ['image/jpeg', 'image/png', 'image/jpg'];
    const mimeType = fileType.find(fileType => fileType === file.mimetype);
    if (mimeType) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

const filesHandler = {
    fileStorage: fileStorage,
    fileFilter: fileFilter,
    saveUploadedFiles: async (req, res, next) => {
        try {
            const { files } = req.body;
            req.body.fileUrls = [];

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
            console.log(req.body.fileUrls);
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default filesHandler