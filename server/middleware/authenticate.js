const {User} = require('./../models/user');

let authenticate = (req, res, next) => {
	let token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if (!user) {
			// If no valid user, but query could not find a matching token
			// Instead of sending a 401 status, we can also stop the function
			// This will run the catch block below and send that same 401 status.
			return Promise.reject();
		}

		req.user = user;
		req.token = token;
		next();

	}).catch((e) => {
		// If the promise is rejected, the catch callback wil fire
		res.status(401).send();
	})
};


module.exports = {authenticate};