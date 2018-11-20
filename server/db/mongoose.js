const mongoose = require('mongoose');

// let db = {
// 	localhost: 'mongodb://127.0.0.1:27017/TodoApp',
//   mlab: 'mongodb://don:1qwerty7@ds119548.mlab.com:19548/mongoose-for-mongodb-nodejs'
// };

mongoose.Promise = global.Promise;
// mongoose.connect(db.localhost || db.mlab) ;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/TodoApp') ;


module.exports = {mongoose}


// let db = {
//   localhost: 'mongodb://localhost:27017/TodoApp',
//   mlab: 'mongodb://<user>:<pass>@ds149268.mlab.com:49268/todoapp'
// };
// mongoose.connect( db.localhost || db.mlab);