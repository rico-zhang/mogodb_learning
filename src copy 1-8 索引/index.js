const { User } = require('./models');

async function test() {

    console.time();
    const result = User.find({
        age: {
            $gt: 20,
            $lt: 50
        }
    });
    console.timeEnd();
}

test();