const { User } = require('./models');

async function test() {

    // let result = await User.findById('5ed093872e3da2b654983476');
    // result = await result.delete();
    const result   =await  User.deleteOne({_id:'5ed093872e3da2b654983476'});
    console.log(result);
}

test();