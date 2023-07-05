import staticDataService from '../service/static-data.js'
import { hasReturnValue } from '../validator/valid.js'

export const getCategoryData = async (req, res, next) => {
    try {
        const data = await staticDataService.getCategoryData(next);

        hasReturnValue(data);

        res.status(data.status.code).json({
            status: data.status,
            category: data.category
        });
    } catch (err) {
        next(err);
    }
};