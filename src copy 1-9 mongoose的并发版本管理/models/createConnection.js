const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
mongoose.plugin(updateIfCurrentPlugin);
mongoose.connect('mongodb://localhost/test',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
let db = mongoose.connection;
db.on('error',()=>{
    console.log('connection error');
});
db.once('open',()=>{
    console.log('连接打开了');
});