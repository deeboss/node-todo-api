const mongoose = require('mongoose');

var Users = mongoose.model('Users', {
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
});

var newUser = new Users({
	email: ""
});

// newUser.save().then((doc) => {
// 	console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
// 	console.log("Unable to save", e);
// })

module.exports = {Users};