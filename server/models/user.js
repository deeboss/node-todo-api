const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: `{VALUE} is not a valid email!`
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function() {
	let user = this;
	let userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

// Not arrow function because we need the 'this' keyword
// Arrow functions don't pass the "this"
UserSchema.methods.generateAuthToken = function() {
	let user = this;
	let access = 'auth';
	let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	user.tokens = user.tokens.concat([{access, token}]);

	return user.save().then(() => {
		return token;
	});
};

// Similar to .methods but instead, it will turn it into a
// Model method rather than instance method
UserSchema.statics.findByToken = function(token) {
	// Uppercase "User" rather than "user"
	// Because instance methods get called by the individual document
	// Model methods get called by the models as the "this" binding
	let User = this;
	let decoded;

	// Try catch block will execute the "try" block first
	// And if there are any errors it will stop the program and run what's
	// inside of the catch block
	// And then it continues with your program rather than stopping everything
	try {
		decoded = jwt.verify(token, 'abc123');
	} catch (e) {
		// ES5 format:
		// return new Promise((resolve, reject) => {
		// 	reject();			
		// })

		// ES6 format:
		// Passing in a value in the argument would get passed on as the 'e' in the
		// catch block in the server.js function
		return Promise.reject();
	}

	// If the token was successfully decoded that was passed in the header
	// Will return a promise. We're returning it so we can add some chaining, like adding
	// a .then call
	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

UserSchema.statics.findByCredentials = function(email, password) {
	let User = this;

	return User.findOne({email}).then((user) => {
		if (!user) {
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			// bcrypt.compare() to compare password and user.password
			// if true, then resolve with the user found
			// if false, then use reject method
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			})
		})
	})
}

// Run some code before the save anything to the database
UserSchema.pre('save', function(next) {
	let user = this;

	if (user.isModified('password')) {
		// Runs if the user's password had already been modified
		// Call gen salt fn, call hash fn
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				// Once you have hash value, then you will set it to user.password
				user.password = hash;
				next();
			});
		});
	} else {
		// Was not modified
		next();
	}
})

let User = mongoose.model('User', UserSchema);

module.exports = {User}