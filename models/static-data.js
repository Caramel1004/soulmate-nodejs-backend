import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema({
    keyword: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

// Hook 함수
// pre: 호출전 콜백 함수 호출
// post: 호출후 콜백 함수 호출
categorySchema.post('find', async result => {
    console.log('result: 현재 카테고리 목록 데이터가 존재합니다.');
    if (result <= 0) {
        console.log('카테고리 데이터가 없습니다.');
        await createCategoryData();
    }
})
const createCategoryData = async () => {
    const categoryList = [
        {
            keyword: 'develop',
            name: '개발'
        },
        {
            keyword: 'design',
            name: '디자인'
        },
        {
            keyword: 'marketing',
            name: '마케팅'
        },
        {
            keyword: 'community',
            name: '커뮤니티'
        },
        {
            keyword: 'education',
            name: '교육'
        },
        {
            keyword: 'game',
            name: '게임'
        },
        {
            keyword: 'another',
            name: '기타'
        }
    ];
    try {
        await Category.insertMany(categoryList);//다수의 데이터 저장
    } catch (error) {
        throw error;
    }
}
const Category = mongoose.model('Category', categorySchema);

export { Category }