const { User } = require('./models');
const { ObjectId } = require('mongoose').Types;

async function test() {

    // const result = await User.findById('5ed093872e3da2b654983476');
    // const result = await User.findById(ObjectId('5ed093872e3da2b654983476'));
    const result = await User.find({
        name: /敏/,
        age:{
            $gt:20,
            $lt:30
        }
    },{
        name:1,
        age:1
    }).sort({age:1});
    console.log(result);
}

test();
