const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');

// Todo.remove({});
// Can't pass in an empty argument to remove all items
// Similar to Todo.find()

// This will remove all items
// Todo.remove({}).then((result) => {
// 	console.log(result)	
// })


//Todo.findOneAndRemove({})
//Todo.findByIdAndRemove({})

// Todo.findOneAndRemove({_id: '5bf3f3d7958528ca9a6d390b'}).then((todo) => {
// 	console.log(todo);
// })

// Todo.findByIdAndRemove('5bf3f3d7958528ca9a6d390b').then((todo) => {
// 	console.log(todo);
// })