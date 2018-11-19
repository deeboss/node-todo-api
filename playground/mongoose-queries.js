const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');

// var id = '5bf29e5ccf03780e55e78421';
var userId = '5bf274f6d5e1e2c85085d98a';
var nonexistentUserId = '6bf274f6d5e1e2c85085d98a';
var invalidUserId = '5bf274f6d5e1e2c85085d98a11'

// if (!ObjectID.isValid(id)) {
// 	console.log('ID not valid');
// }

// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log("Todos", todos);
// })


// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log("Todo", todo);
// })


// Todo.findById(id).then((todo) => {
// 	if (!todo) {
// 		return console.log("ID not found");
// 	}
// 	console.log("Todos by ID", todo);
// }).catch((e) => console.log(e));

Users.findById('5bf274f6d5e1e2c85085d98a').then((user) => {
	if(!user) {
		return console.log("Error, user not found");
	}
	console.log("User by ID:", JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
