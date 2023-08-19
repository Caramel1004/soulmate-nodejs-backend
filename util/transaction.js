import mongoose from "mongoose";

const db = mongoose.connection;

// // 트랜젝션 시작
// export const startSession = mongoose.startSession;

// // commit
// export const commitTransaction = mongoose.commitTransaction;

// // 트렌젝션 종료
// export const endSession = mongoose.endSession;

// // rollback
// export const abortTransaction = mongoose.abortTransaction;

export default db

