const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: "example@example.com",
	password: "userOnePass",
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
	}]
}, {
	_id: userTwoId,
	email: "another@example.com",
	password: "userTwoPass"
}];

const todos = [{
	_id: new ObjectID(),
	text: "Eat breakfast",
	completed: true,
	completedAt: 123
}, {
	_id: new ObjectID(),
	text: "Eat second breakfast",
	completed: true,
	completedAt: 123
}, {
	_id: new ObjectID(),
	text: "Take a nap",
	completed: true,
	completedAt: 123
}];

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
}


// Unlike the populateTodos method above, we need populateUsers
// to run through the middleware so that the passwords can properly
// be hashed. So, to accomplish this we are running a few promises
// which will be waiting to be resolve and the proper values can be
// passed through for future usage.
const populateUsers = (done) => {
	User.remove({}).then(() => {

		// The save() method will run through the middleware
		let userOne = new User(users[0]).save();
		let userTwo = new User(users[1]).save();

		// The Promise takes in an array of objects, and will wait
		// for the promises to be resolved first before moving on
		// with the rest of the function
		return Promise.all([userOne, userTwo]);

	}).then(() => done());
}

module.exports = { todos, populateTodos, users, populateUsers };