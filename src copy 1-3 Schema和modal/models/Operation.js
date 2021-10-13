//1. 定义Operation Schema
const mongoose = require('mongoose');
const addressSchema = require('./addressSchema');
const operationTypes = require('./operationTypes');
const operationSchema = new mongoose.Schema({
    //Schema 的配置
    operation: {
        type: String,
        required: true,
        enum: operationTypes
    },
    time: {
        type: Date,
        default: Date.now,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    extraInfo: {
        type: mongoose.Schema.Types.Mixed,//任意类型
    },
    address: {
        type: addressSchema,
        required: true
    }
});



//2. 通过Operation Schema 定义模型 最终导出模型
module.exports = mongoose.model('Operation', operationSchema);