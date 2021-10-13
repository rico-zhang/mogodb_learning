const { User } = require('./models');
let obj = {
    loginId: 'user4',
    loginPwd: 'jhjrhkdf',
    name: 'rico',
    address: {
        province: '河南',
        city: '安阳'
    }
};
const user = new User(obj);

//使用实例回调
// user.save((err, result) => {
//     console.log(err);
//     console.log(result);
// });

//使用实例异步
// async function test() {
//     const result = await user.save();
//     console.log(result);
// }
// test();

//直接创建
async function test(){
    const result = await User.create(obj);
    result.name='long';
    await result.save();
    // const result = await User.create(obj,obj2);
    // const result = await User.create([ojb1,obj2]);
    console.log(result);
}

test();