const config = require('./config/config');

const _ = require('lodash');

const express = require('express');
const bodyParser = require("body-parser");
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const port = process.env.PORT;

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (err) => {
		res.status(400).send(err)
	});
})

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
})

// GET /todos/1234
app.get('/todos/:id', (req, res) => {
	var id = req.params.id;

	// validate ID using ObjectID.isValid
	// If not valid, respond with 404
		// Send back empty body with 404
	if (!ObjectID.isValid(id)) {
		return res.status(404).send("Sorry, could not handle request");
	}

	// findById
	Todo.findById(id).then((todo) => {
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
app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;

	// Validate ID, if not valid then return 404
	if (!ObjectID.isValid(id)) {
		return res.status(404).send("Sorry, your ID was not valid");
	}

	// If valid, remove todo by ID
	// Success
	Todo.findByIdAndRemove(id).then((todo) => {
		// If no doc, send 404
		if (!todo) {
			return res.status(404).send("Your todo item does not exist!");
		}

		// If doc, send doc back with 200
		res.send({todo});


	}).catch((e) => {
		// Error
			// 400
			// Empty body
		res.status(400).send();
	})


});

// PATCH /todo/1234
app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;

	// Lodash will help to pick out which objects that it will pull off
	// This will be used to select which properties the users can update
	// This has a subset of the things the user passed to us. We don't want the
	// Users to be able update whatever they choose
	var body = _.pick(req.body, ['text', 'completed'])

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
	Todo.findByIdAndUpdate(id, {
		$set: body
	}, {
		new: true
	}).then((todo) => {
		if (!todo) {
			return res.status(400).send()
		}

		res.send({todo});

	}).catch((e) => {
		res.status(400).send("Sorry, there was an error processing your request")
	})

})

// POST /users/
// Most similar is to create a new route for todo
// Pick off the properties, email and password (and gives body variable to pass in)
app.post('/users', (req, res) => {
	let body = _.pick(req.body, ['email', 'password']);
	let user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	});

});


app.get('/users/me', (req, res) => {
	var token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if (!user) {

		}
		res.send(user);
	});
});

app.listen(port, () => {
	console.log(`Listening at ${port}`);
});


module.exports = {app};