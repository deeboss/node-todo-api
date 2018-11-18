// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log("Unable to connect to MongoDB server")
	}

	console.log("Success! Connected to MongoDB server");
	const db = client.db("TodoApp");


	// findOneAndUpdate
	// db.collection("Todos").findOneAndUpdate({
	// 	_id: new ObjectID('5bf133d618d7c4367ec16d93')
	// }, {
	// 	$set: {
	// 		completed: true
	// 	}
	// }, {
	// 	returnOriginal: false
	// }).then((result) => {
	// 	console.log(result);
	// })

	db.collection("Users").findOneAndUpdate({
		_id: new ObjectID('5bf12a4426c34345fcb804fa')
	}, {
		$set: {
			location: "Hong Kong"
		},
		$inc: {
			age: 1
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	})

	// client.close();
});