const express = require('express');
const bodyParser = require("body-parser");

const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {Users} = require('./models/user');

const port = process.env.PORT || 3000;

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

app.listen(port, () => {
	console.log(`Listening at ${port}`);
});


module.exports = {app};