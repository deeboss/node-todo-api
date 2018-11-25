const config = require('./config/config');

const _ = require('lodash');

const express = require('express');
const bodyParser = require("body-parser");
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT;

let app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (err) => {
		res.status(400).send(err)
	});
})

app.get('/todos', authenticate, (req, res) => {
	Todo.find({
		_creator: req.user._id
	}).then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
})

// GET /todos/1234
app.get('/todos/:id', authenticate, (req, res) => {
	let id = req.params.id;

	// validate ID using ObjectID.isValid
	// If not valid, respond with 404
		// Send back empty body with 404
	if (!ObjectID.isValid(id)) {
		return res.status(404).send("Sorry, could not handle request");
	}

	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		// If no todo - send back 404 with empty body
		if (!todo) {
			return res.status(404).send("No Todo of that ID found");
		}
		// Success
		// If todo - send it back
		res.send({todo});
	}).catch((e) => {
		// Error
			// 400
			// Send empty body back. Don't send back the error
		res.status(400).send();
	});
}) 

// DELETE /todo/1234

// OLD - Promises and Callback chaining
// app.delete('/todos/:id', authenticate, (req, res) => {
// 	let id = req.params.id;

// 	// Validate ID, if not valid then return 404
// 	if (!ObjectID.isValid(id)) {
// 		return res.status(404).send("Sorry, your ID was not valid");
// 	}

// 	// If valid, remove todo by ID
// 	// Success
// 	Todo.findOneAndRemove({
// 		_id: id,
// 		_creator: req.user._id
// 	}).then((todo) => {
// 		// If no doc, send 404
// 		if (!todo) {
// 			return res.status(404).send("Your todo item does not exist!");
// 		}

// 		// If doc, send doc back with 200
// 		res.send({todo});


// 	}).catch((e) => {
// 		// Error
// 			// 400
// 			// Empty body
// 		res.status(400).send();
// 	})


// });


// NEW - Async and Await
app.delete('/todos/:id', authenticate, async (req, res) => {
	const id = req.params.id;
	// Validate ID, if not valid then return 404
	if (!ObjectID.isValid(id)) {
		return res.status(404).send("Sorry, your ID was not valid");
	}

	try {

		// If valid, remove todo by ID
		// Success
		const todo = await Todo.findOneAndRemove({_id: id, _creator: req.user._id})

		// If no doc, send 404
		if (!todo) {
			return res.status(404).send("Your todo item does not exist!");
		}
		// If doc, send doc back with 200
		res.send({todo});
		
	} catch {
		res.status(400).send();	
	}
})

// PATCH /todo/1234
app.patch('/todos/:id', authenticate, (req, res) => {
	let id = req.params.id;

	// Lodash will help to pick out which objects that it will pull off
	// This will be used to select which properties the users can update
	// This has a subset of the things the user passed to us. We don't want the
	// Users to be able update whatever they choose
	let body = _.pick(req.body, ['text', 'completed'])

	// Validate ID, if not valid then return 404
	if (!ObjectID.isValid(id)) {
		return res.status(404).send("Sorry, your ID was not valid");
	}


	// We updated the "Completed" property based off of its completed value
	// If it was already completed, then it would be unmarked as completed
	// If it was not completed yet, then we marked it as "Completed: True"
	// And also set the CompletedAt time to match the timestamp of the completion time
	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	// The update values are passed onto the database.
	Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
	}, {
		$set: body
	}, {
		new: true
	}).then((todo) => {
		if (!todo) {
			return res.status(404).send()
		}

		res.send({todo});

	}).catch((e) => {
		res.status(400).send("Sorry, there was an error processing your request")
	})

})

// POST /users/
// Most similar is to create a new route for todo
// Pick off the properties, email and password (and gives body variable to pass in)

// OLD - Promises and Callback chaining
// app.post('/users', (req, res) => {
// 	let body = _.pick(req.body, ['email', 'password']);
// 	let user = new User(body);

// 	user.save().then(() => {
// 		return user.generateAuthToken();
// 	}).then((token) => {
// 		res.header('x-auth', token).send(user);
// 	}).catch((e) => {
// 		res.status(400).send(e);
// 	});

// });

// NEW - Async and Await
app.post('/users', async (req, res) => {
	try {
		const body = _.pick(req.body, ['email', 'password']);
		const user = new User(body);
		await user.save();
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

// OLD - Promises and Callback chaining
// app.post('/users/login', (req,res) => {
// 	let body = _.pick(req.body, ['email', 'password']);

// 	User.findByCredentials(body.email, body.password).then((user) => {
// 		return user.generateAuthToken().then((token) => {
// 			res.header('x-auth', token).send(user);
// 		});
// 	}).catch((e) => {
// 		res.status(400).send();
// 	})

// });

// NEW - Async and Await
app.post('/users/login', async (req,res) => {
	try {
		const body = _.pick(req.body, ['email', 'password']);
		const user = await User.findByCredentials(body.email, body.password);
		const token = await user.generateAuthToken();
		res.header('x-auth', token).send(user);
	} catch(e) {
		res.status(400).send();
	}
});


// OLD - Promises and Callback chaining
// app.delete('/users/me/token', authenticate, (req, res) => {
// 	req.user.removeToken(req.token).then(() => {
// 		res.status(200).send();
// 	}, () => {
// 		res.status(400).send();
// 	});
// });

// NEW - Async and Await
app.delete('/users/me/token', authenticate, async (req, res) => {
	try {
		await req.user.removeToken(req.token);
		res.status(200).send();
	} catch(e) {
		res.status(400).send();
	}
});

app.listen(port, () => {
	console.log(`Listening at ${port}`);
});


module.exports = {app};