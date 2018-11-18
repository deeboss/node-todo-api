// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log("Unable to connect to MongoDB server")
	}

	console.log("Success! Connected to MongoDB server");
	const db = client.db("TodoApp");

	// db.collection('Todos').find({
	// 	_id: new ObjectID("5bf12c9218d7c4367ec16bad")
	// }).toArray().then((docs) => {
	// 	console.log("Todos");
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log("Unable to fetch Todos", err)
	// })

	// db.collection('Todos').find().count().then((count) => {
	// 	console.log(`Todos count: ${count}`);
	// }, (err) => {
	// 	console.log("Unable to fetch Todos", err)
	// })

	db.collection('Users').find({name: 'George'}).toArray().then((docs) => {
		console.log("Users that matched your query");
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log("Unable to fetch Users", err)
	})

	client.close();
});