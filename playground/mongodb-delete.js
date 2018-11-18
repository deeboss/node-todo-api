// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log("Unable to connect to MongoDB server")
	}

	console.log("Success! Connected to MongoDB server");
	const db = client.db("TodoApp");

	// deleteMany
	// db.collection("Todos").deleteMany({text: "Eat lunch"}).then((result) => {
	// 	console.log(result);
	// })

	// deleteOne
	// db.collection("Todos").deleteOne({text: "Eat lunch"}).then((result) => {
	// 	console.log(result);
	// })

	// findOneAndDelete
	// db.collection("Todos").findOneAndDelete({completed: false}).then((result) => {
	// 	console.log(result);
	// })

	// deleteMany users of a duplicate entry
	// db.collection("Users").deleteMany({name: "George"}).then((result) => {
	// 	console.log(result);
	// })

	// findOneAndDelete any user but based on ID
	db.collection("Users").findOneAndDelete({_id: new ObjectID('5bf12f27fa0f54468d0da3df')}).then((result) => {
		console.log(result);
	})

	// client.close();
});