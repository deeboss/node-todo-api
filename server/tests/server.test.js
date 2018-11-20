const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text: "Eat breakfast"
}, {
	_id: new ObjectID(),
	text: "Eat second breakfast"
}, {
	_id: new ObjectID(),
	text: "Take a nap"
}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

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