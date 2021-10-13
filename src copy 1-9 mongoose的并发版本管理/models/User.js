//1. 定义User Schema
const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const addressSchema = require('./addressSchema');
const userScema = new mongoose.Schema({
    //Schema 的配置
    loginId: {
        type: String,//类型是字符串
        required: true,//必填
        trim: true,
        minlength: 3,
        maxlength: 18,

        index: true,//将该字段设置索引
        unique: true,//唯一索引
    },
    loginPwd: {
        type: String,//类型是字符串
        required: true,//必填
        trim: true,
        select: false,//默认情况下 查询用户时不会查询该字段
    },
    name: {
        type: String,//类型是字符串
        required: true,//必填
        trim: true,
        minlength: 2,
        maxlength: 10,
    },
    age: {
        type: Number,
        default: 18
    },
    loves: {
        type: [String],
        required: true,
        default: [],//默认值为一个空数组
    },
    address: {
        type: addressSchema,
        required: true
    }
});
userScema.plugin(updateIfCurrentPlugin);

//2. 通过User Schema定义模型 最终导出模型
module.exports = mongoose.model('User', userScema);