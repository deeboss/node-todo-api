// const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		let text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})

			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)

			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(3);
					done();
				}).catch((e) => done(e));
			});
	});
});

describe('GET /todos', () => {
	it('should GET all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(3);
			})

			.end(done);
	})
})


describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {

		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text)
			})
			.end(done);
	});

	it('should return a 404 if todo not found', (done) => {
		// Make a request using a real ObjectID and call its toHexString()
		// will be valid id, but won't exist
		// Make sure status code = 404 that's it

		var testHexId = new ObjectID().toHexString();

		request(app)
			.get(`/todos/${testHexId}`)
			.expect(404)
			.end(done);
	});

	it('should return a 404 for non valid objectIDs', (done) => {
		// /todos/123
		// Is a valid ID but should fail because it's not a valid objectID
		// Only expectation is that the GET request should return a 404 status code

		request(app)
			.get('/todos/123')
			.expect(404)
			.end(done);
	})
})

describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				// Query Database using findById
				// find todo item with that ID
				// It SHOULD fail because it was supposedly deleted
				// Make sure it doesn't exist
				// Use expect(null).toNotExist() assertion
				// Instead of Null pass the todo argument, which is in the success handler
				Todo.findById(hexId).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((e) => done(e));

			})
	});

	it('should return 404 if todo not found', (done) => {
		var testHexId = new ObjectID().toHexString();

		request(app)
			.delete(`/todos/${testHexId}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 if ObjectID is invalid', (done) => {
		request(app)
			.delete('/todos/123')
			.expect(404)
			.end(done);
	});
});


describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {

		// Grab ID of first item
		let id = todos[0]._id.toHexString();
		let text = "Updated for the test!";

		request(app)
			// make PATCH request with proper id
			.patch(`/todos/${id}`)
			// use send to send some data along with req body
			// update text to whatever
			// set completed = true
			.send({
				text,
				completed: true
			})
			// Assert: get 200 back
			.expect(200)
			.expect((res) => {
				// Assert: response body has text = to text sent in
				// Assert: completed is true
				// Assert: completedAt is a Number, you can use .toBeA
				// console.log(res.body.todo.text);
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);
	});

	it('should clear completedAt when todo is NOT completed', (done) => {
		// Grab ID of second todo item
		let id = todos[1]._id.toHexString();
		let text = "Update for the second todo item for the test!";

		// make PATCH request with proper id
		request(app)
			.patch(`/todos/${id}`)
			// update text to something
			// set completed = false
			.send({
				text,
				completed: false
			})
			// Assert: get 200 back
			.expect(200)
			.expect((res) => {
				// Assert: response body text = text sent in
				// Assert: completed is false
				// Assert: completedAt is null, you can use .toNotExist();
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end(done);
			

	});
})


describe('GET /users/me', () => {
	it('should return a user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return a 401 if NOT authenticated', (done) => {
			request(app)
				.get('/users/me')
				.expect(401)
				.expect((res) => {
					expect(res.body).toEqual({});
				})
				.end(done);
	});
});

describe('POST /users/', () => {
	it('should create a user', (done) => {
		let email = 'example@email.com';
		let password = '123abcd!!!';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if (err) {
					return done(err);
				}

				User.findOne({email}).then((user) => {
					expect(user).toExist();
					expect(user.password).toNotBe(password);
					done();
				}).catch((e) => done(e))
			});
	});

	it('should return validation errors if request is invalid', (done) => {
		// Send invalid email + invalid password
		// expect 400

		request(app)
			.post('/users')
			.send({
				email: '12ge',
				password: '123'
			})
			.expect(400)
			.end(done)
	});

	it('should not create user if email is in use', (done) => {
		// use email that's already taken
		// should fail and expect a 400 to come back
		request(app)
			.post('/users')
			.send({
				email: users[0].email,
				password: 'password@8r932y89'
			})
			.expect(400)
			.end(done)
	});

})


describe('POST /users/login', () => {
	it('should login user and return auth token', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect((res) => {
				expect(res.header['x-auth']).toExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[0]).toInclude({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done();
				}).catch((e) => done(e))
			});
	});

	it('should reject invalid login', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password + '190h290'
			})
			.expect(400)
			.expect((res) => {
				expect(res.header['x-auth']).toNotExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((e) => done(e))
			});
	});
})
