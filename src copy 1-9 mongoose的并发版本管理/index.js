const { User } = require('./models');

async function test() {
    let user1 = await User.findById('5ed093872e3da2b654983492');
    let user2 = await User.findById('5ed093872e3da2b654983492');

    user1.name = 'long';
    user1 = await user1.save();

    user2.name = 'qi';
    user2 = await user2.save();

    console.log(user1, user2);
}

test();