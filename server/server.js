const express = require('express');
const bodyParser = require("body-parser");

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {Users} = require('./models/user');


let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	let todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
		// console.log(JSON.stringify(doc, undefined, 2));
	}, (err) => {
		res.status(400).send("Could not save", err)
	})
})

app.listen('3000', () => {
	console.log("Listening at port 3000");
});