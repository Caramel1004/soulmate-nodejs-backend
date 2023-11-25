import { Category } from "../models/static-data.js";
import { hasCategoryData } from '../validator/valid.js'
import { successType } from '../util/status.js';

/**
 * 1. 채널 카테고리 조회
 */

const staticDataService = {
    getCategoryData: async next => {
        try {
            const category = await Category.find()
                .sort({
                    _id: 1
                });

            return {
                status: successType.S02.s200,
                category: category
            }
        } catch (err) {
            next(err);
        }
    }
}

export default staticDataService;