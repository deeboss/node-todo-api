const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true 
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	}
});

// var newTodo = new Todo({
//   text: 'Eat lunch'
// });

// newTodo.save().then((doc) => {
//   console.log("Saved to do", doc);
// }, (e) => {
//   console.log('Unable to save');
// });

// var otherTodo = new Todo({
  
// });

// otherTodo.save().then((doc) => {
//   // console.log("Saved to do", doc);
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log('Unable to save', e);
// });

module.exports = {Todo};