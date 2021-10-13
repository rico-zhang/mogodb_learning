const { User } = require('./models');

async function test() {
    let user1 = await User.findById('5ed093872e3da2b654983492');
    console.log(user1.info);
    user1.log();
    User.staticLog();
}

test();